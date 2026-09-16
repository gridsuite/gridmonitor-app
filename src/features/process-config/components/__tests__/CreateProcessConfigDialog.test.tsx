/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { IntlProvider } from 'react-intl';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateProcessConfigDialog } from '../CreateProcessConfigDialog';

const mocks = vi.hoisted(() => ({
    reset: vi.fn(),
    submit: vi.fn(),
    createProcessConfig: vi.fn(),
    fetchProcessConfigPrefill: vi.fn(),
    formMethods: {
        formState: {
            errors: {},
        },
    },
    defaultValues: {
        name: '',
        description: '',
    },
    formSchema: {},
    isCreating: false,
    isSubmitting: false,
}));

vi.mock('@gridsuite/commons-ui', () => ({
    CustomFormProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,

    ProcessConfigForm: ({
        form,
        mode,
        onFetchProcessConfig,
    }: {
        form: unknown;
        mode: string;
        onFetchProcessConfig: unknown;
    }) => (
        <div
            data-testid="process-config-form"
            data-mode={mode}
            data-has-form={String(form != null)}
            data-has-prefill={String(onFetchProcessConfig === mocks.fetchProcessConfigPrefill)}
        />
    ),

    isDisabledValidationButton: (errors: object) => Object.keys(errors).length > 0,

    useProcessConfigForm: () => ({
        formMethods: {
            ...mocks.formMethods,
            reset: mocks.reset,
        },
        formSchema: mocks.formSchema,
        defaultValues: mocks.defaultValues,
    }),
}));

vi.mock('../../hooks/use-create-process-config', () => ({
    useCreateProcessConfig: () => ({
        createProcessConfig: mocks.createProcessConfig,
        isCreating: mocks.isCreating,
        isError: false,
        error: undefined,
        createdConfigUuid: undefined,
    }),
    useProcessConfigPrefill: () => mocks.fetchProcessConfigPrefill,
}));

vi.mock('../../hooks/useCreateProcessConfigSubmit', () => ({
    useCreateProcessConfigSubmit: () => ({
        submit: mocks.submit,
        isSubmitting: mocks.isSubmitting,
    }),
}));

vi.mock('shared/ui/AppDialog', () => ({
    AppDialog: ({
        open,
        title,
        children,
        onClose,
        onConfirm,
        confirmDisabled,
    }: {
        open: boolean;
        title: React.ReactNode;
        children: React.ReactNode;
        onClose: () => void;
        onConfirm?: () => void;
        confirmDisabled?: boolean;
    }) =>
        open ? (
            <div role="dialog">
                <h1>{title}</h1>
                <button type="button" aria-label="Close" onClick={onClose}>
                    Close
                </button>
                {children}
                {onConfirm && (
                    <button type="button" onClick={onConfirm} disabled={confirmDisabled}>
                        Validate
                    </button>
                )}
            </div>
        ) : null,
}));

function renderDialog(open = true, onClose = vi.fn()) {
    return render(
        <IntlProvider
            locale="en"
            messages={{
                processConfigCreateTitle: 'Create process configuration',
            }}
        >
            <CreateProcessConfigDialog open={open} onClose={onClose} />
        </IntlProvider>
    );
}

describe('CreateProcessConfigDialog', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mocks.formMethods.formState.errors = {};
        mocks.isCreating = false;
        mocks.isSubmitting = false;
    });

    it('renders the dialog and process configuration form when open', () => {
        renderDialog();

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Create process configuration' })).toBeInTheDocument();
        expect(screen.getByTestId('process-config-form')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Validate' })).toBeEnabled();
    });

    it('does not render the dialog when closed', () => {
        renderDialog(false);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('resets the form and calls onClose when the dialog is closed', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        renderDialog(true, onClose);

        await user.click(screen.getByRole('button', { name: 'Close' }));

        expect(mocks.reset).toHaveBeenCalledWith(mocks.defaultValues);
        expect(onClose).toHaveBeenCalledOnce();
    });

    it('calls submit when the validate button is clicked', async () => {
        const user = userEvent.setup();

        renderDialog();

        await user.click(screen.getByRole('button', { name: 'Validate' }));

        expect(mocks.submit).toHaveBeenCalledOnce();
    });

    it('disables validation when the form contains errors', () => {
        mocks.formMethods.formState.errors = {
            name: {
                type: 'required',
                message: 'Name is required',
            },
        };

        renderDialog();

        expect(screen.getByRole('button', { name: 'Validate' })).toBeDisabled();
    });

    it('disables validation while creating a process configuration', () => {
        mocks.isCreating = true;

        renderDialog();

        expect(screen.getByRole('button', { name: 'Validate' })).toBeDisabled();
    });

    it('disables validation while submitting', () => {
        mocks.isSubmitting = true;

        renderDialog();

        expect(screen.getByRole('button', { name: 'Validate' })).toBeDisabled();
    });

    it('passes create mode and prefill handler to the process configuration form', () => {
        renderDialog();

        const form = screen.getByTestId('process-config-form');

        expect(form).toHaveAttribute('data-mode', 'create');
        expect(form).toHaveAttribute('data-has-form', 'true');
        expect(form).toHaveAttribute('data-has-prefill', 'true');
    });
});

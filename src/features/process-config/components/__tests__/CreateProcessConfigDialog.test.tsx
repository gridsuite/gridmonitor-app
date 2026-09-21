/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateProcessConfigDialog } from '../CreateProcessConfigDialog';

const mocks = vi.hoisted(() => ({
    useProcessConfigForm: vi.fn(),
    useCreateProcessConfig: vi.fn(),
    useProcessConfigPrefill: vi.fn(),
    useCreateProcessConfigSubmit: vi.fn(),
}));

vi.mock('@gridsuite/commons-ui', () => ({
    CustomFormProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    ProcessConfigForm: () => <div data-testid="process-config-form" />,
    useProcessConfigForm: mocks.useProcessConfigForm,
}));

vi.mock('shared/ui/AppDialog', () => ({
    AppDialog: ({
        open,
        onClose,
        onConfirm,
        confirmDisabled,
        title,
        children,
    }: {
        open: boolean;
        onClose: () => void;
        onConfirm: () => void;
        confirmDisabled: boolean;
        title: React.ReactNode;
        children: React.ReactNode;
    }) =>
        open ? (
            <div role="dialog">
                {title}
                {children}
                <button type="button" aria-label="close" onClick={onClose} />
                <button type="button" aria-label="confirm" onClick={onConfirm} disabled={confirmDisabled} />
            </div>
        ) : null,
}));

vi.mock('../../hooks/use-create-process-config', () => ({
    useCreateProcessConfig: mocks.useCreateProcessConfig,
    useProcessConfigPrefill: mocks.useProcessConfigPrefill,
}));

vi.mock('../../hooks/useCreateProcessConfigSubmit', () => ({
    useCreateProcessConfigSubmit: mocks.useCreateProcessConfigSubmit,
}));

const defaultValues = { name: '', description: '' };
const formMethods = { reset: vi.fn(), formState: { isValid: true } };
const onClose = vi.fn();
const submit = vi.fn();

function renderDialog() {
    return render(
        <IntlProvider locale="en" messages={{ processConfigCreateTitle: 'Create process configuration' }}>
            <CreateProcessConfigDialog open onClose={onClose} />
        </IntlProvider>
    );
}

beforeEach(() => {
    vi.clearAllMocks();
    formMethods.formState.isValid = true;
    mocks.useProcessConfigForm.mockReturnValue({
        formMethods,
        formSchema: {},
        defaultValues,
    });
    mocks.useCreateProcessConfig.mockReturnValue({ createProcessConfig: vi.fn(), isCreating: false });
    mocks.useProcessConfigPrefill.mockReturnValue(vi.fn());
    mocks.useCreateProcessConfigSubmit.mockReturnValue({ submit, isSubmitting: false });
});

describe('CreateProcessConfigDialog', () => {
    it('renders the form and submits it from the confirmation action', () => {
        renderDialog();

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Create process configuration')).toBeInTheDocument();
        expect(screen.getByTestId('process-config-form')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'confirm' }));

        expect(submit).toHaveBeenCalledOnce();
    });

    it('prevents submission when the form is invalid', () => {
        formMethods.formState.isValid = false;
        renderDialog();

        expect(screen.getByRole('button', { name: 'confirm' })).toBeDisabled();
    });

    it('resets the form before closing', () => {
        renderDialog();

        fireEvent.click(screen.getByRole('button', { name: 'close' }));

        expect(formMethods.reset).toHaveBeenCalledWith(defaultValues);
        expect(onClose).toHaveBeenCalledOnce();
    });
});

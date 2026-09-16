/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { ReactNode } from 'react';
import { CreateProcessConfigDialog } from '../CreateProcessConfigDialog';

const mocks = vi.hoisted(() => ({
    useProcessConfigForm: vi.fn(),
    useCreateProcessConfig: vi.fn(),
    useProcessConfigPrefill: vi.fn(),
    useCreateProcessConfigSubmit: vi.fn(),
    captured: {
        appDialog: null as null | Record<string, unknown>,
        formProvider: null as null | Record<string, unknown>,
        processConfigForm: null as null | Record<string, unknown>,
    },
}));

vi.mock('@gridsuite/commons-ui', () => ({
    CustomFormProvider: ({ children, ...rest }: { children?: unknown }) => {
        mocks.captured.formProvider = rest;
        return <>{children}</>;
    },
    ProcessConfigForm: (props: Record<string, unknown>) => {
        mocks.captured.processConfigForm = props;
        return <div data-testid="process-config-form" />;
    },
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
        onConfirm?: () => void;
        confirmDisabled?: boolean;
        title?: string;
        children?: ReactNode;
    }) => {
        mocks.captured.appDialog = { open, onClose, onConfirm, confirmDisabled, title, children };
        if (!open) {
            return null;
        }
        return (
            <div role="dialog">
                <h2>{title}</h2>
                {children}
                <button type="button" aria-label="dialog-close" onClick={() => onClose()} />
                <button type="button" aria-label="dialog-cancel" onClick={() => onClose()} />
                <button type="button" aria-label="dialog-confirm" onClick={onConfirm} disabled={confirmDisabled} />
            </div>
        );
    },
}));

vi.mock('../../hooks/use-create-process-config', () => ({
    useCreateProcessConfig: mocks.useCreateProcessConfig,
    useProcessConfigPrefill: mocks.useProcessConfigPrefill,
}));

vi.mock('../../hooks/useCreateProcessConfigSubmit', () => ({
    useCreateProcessConfigSubmit: mocks.useCreateProcessConfigSubmit,
}));

const messages = { processConfigCreateTitle: 'Create process configuration' };

const defaultValues = { name: '', description: '' };
const formSchema = { safeParse: vi.fn() };
const createProcessConfig = vi.fn();
const prefill = vi.fn();
const submit = vi.fn();
const onClose = vi.fn();

type FormMethodsMock = { reset: Mock; formState: { isValid: boolean } };
let formMethods: FormMethodsMock;

function setup({ isValid = true, isSubmitting = false, isCreating = false } = {}) {
    formMethods = { reset: vi.fn(), formState: { isValid } };
    mocks.useProcessConfigForm.mockReturnValue({ formMethods, formSchema, defaultValues });
    mocks.useCreateProcessConfig.mockReturnValue({ createProcessConfig, isCreating });
    mocks.useProcessConfigPrefill.mockReturnValue(prefill);
    mocks.useCreateProcessConfigSubmit.mockReturnValue({ submit, isSubmitting });
}

function renderDialog(open = true) {
    return render(
        <IntlProvider locale="en" messages={messages}>
            <CreateProcessConfigDialog open={open} onClose={onClose} />
        </IntlProvider>
    );
}

function getSubmitHookArgs() {
    expect(mocks.useCreateProcessConfigSubmit).toHaveBeenCalledTimes(1);
    return mocks.useCreateProcessConfigSubmit.mock.calls[0][0] as {
        form: FormMethodsMock;
        createProcessConfig: Mock;
        onClose: () => void;
    };
}

beforeEach(() => {
    vi.clearAllMocks();
    mocks.captured.appDialog = null;
    mocks.captured.formProvider = null;
    mocks.captured.processConfigForm = null;
    setup();
});

describe('CreateProcessConfigDialog', () => {
    describe('mocking sanity', () => {
        it('has every external dependency mocked', () => {
            expect(vi.isMockFunction(mocks.useProcessConfigForm)).toBe(true);
            expect(vi.isMockFunction(mocks.useCreateProcessConfig)).toBe(true);
            expect(vi.isMockFunction(mocks.useProcessConfigPrefill)).toBe(true);
            expect(vi.isMockFunction(mocks.useCreateProcessConfigSubmit)).toBe(true);
        });
    });

    describe('hook wiring', () => {
        it('initializes the process config form in create mode', () => {
            renderDialog();

            expect(mocks.useProcessConfigForm).toHaveBeenCalledTimes(1);
            expect(mocks.useProcessConfigForm).toHaveBeenCalledWith({ mode: 'create' });
        });

        it('passes formMethods, schema and prefill handler down to the form', () => {
            renderDialog();

            const providerProps = mocks.captured.formProvider!;
            expect(providerProps.validationSchema).toBe(formSchema);
            expect(providerProps.reset).toBe(formMethods.reset);

            const formProps = mocks.captured.processConfigForm!;
            expect(formProps.form).toBe(formMethods);
            expect(formProps.mode).toBe('create');
            expect(formProps.onFetchProcessConfig).toBe(prefill);
        });

        it('wires the submit hook with the form, the creation callback and handleClose', () => {
            renderDialog();

            const args = getSubmitHookArgs();
            expect(args.form).toBe(formMethods);
            expect(args.createProcessConfig).toBe(createProcessConfig);
            expect(args.onClose).toBeTypeOf('function');
        });
    });

    describe('rendering', () => {
        it('renders the dialog with translated title and the form when open', () => {
            renderDialog();

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText('Create process configuration')).toBeInTheDocument();
            expect(screen.getByTestId('process-config-form')).toBeInTheDocument();
        });

        it('renders nothing when closed', () => {
            renderDialog(false);

            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            expect(screen.queryByTestId('process-config-form')).not.toBeInTheDocument();
        });
    });

    describe('confirm', () => {
        it('calls submit when the confirm button is clicked', () => {
            renderDialog();

            fireEvent.click(screen.getByRole('button', { name: 'dialog-confirm' }));

            expect(submit).toHaveBeenCalledTimes(1);
        });

        it('disables confirm when the form is invalid', () => {
            setup({ isValid: false });
            renderDialog();

            expect(screen.getByRole('button', { name: 'dialog-confirm' })).toBeDisabled();
        });

        it('disables confirm while submitting', () => {
            setup({ isSubmitting: true });
            renderDialog();

            expect(screen.getByRole('button', { name: 'dialog-confirm' })).toBeDisabled();
        });

        it('disables confirm while creating', () => {
            setup({ isCreating: true });
            renderDialog();

            expect(screen.getByRole('button', { name: 'dialog-confirm' })).toBeDisabled();
        });

        it('enables confirm when valid and idle', () => {
            renderDialog();

            expect(screen.getByRole('button', { name: 'dialog-confirm' })).toBeEnabled();
        });
    });

    describe('closing', () => {
        it('resets the form and calls onClose when the dialog is closed', () => {
            renderDialog();

            fireEvent.click(screen.getByRole('button', { name: 'dialog-close' }));

            expect(formMethods.reset).toHaveBeenCalledTimes(1);
            expect(formMethods.reset).toHaveBeenCalledWith(defaultValues);
            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it('routes the cancel action through the same handleClose', () => {
            renderDialog();

            fireEvent.click(screen.getByRole('button', { name: 'dialog-cancel' }));

            expect(formMethods.reset).toHaveBeenCalledWith(defaultValues);
            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it('exposes that same handleClose to the submit hook', () => {
            renderDialog();

            const { onClose: submitOnClose } = getSubmitHookArgs();
            submitOnClose();

            expect(formMethods.reset).toHaveBeenCalledWith(defaultValues);
            expect(onClose).toHaveBeenCalledTimes(1);
        });
    });
});

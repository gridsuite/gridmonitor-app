/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useFormContext, Controller } from 'react-hook-form';
import { IntlProvider } from 'react-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PROCESS_CONFIG_TYPES } from '@gridsuite/commons-ui';
import messagesEn from 'shared/translations/en/common.json';
import { ExecuteProcessConfigDialog } from '../ExecuteProcessConfigDialog';

const mocks = vi.hoisted(() => ({
    executeProcess: vi.fn(),
}));

vi.mock('shared/ui/AppDialog', () => ({
    AppDialog: ({
        open,
        onClose,
        onCancel,
        onBack,
        onConfirm,
        confirmDisabled,
        confirmLabel,
        title,
        children,
    }: {
        open: boolean;
        onClose: () => void;
        onCancel?: () => void;
        onBack?: () => void;
        onConfirm: () => void;
        confirmDisabled: boolean;
        confirmLabel: React.ReactNode;
        title: React.ReactNode;
        children: React.ReactNode;
    }) =>
        open ? (
            <div role="dialog">
                <h1>{title}</h1>
                {children}
                {onBack && (
                    <button type="button" onClick={onBack}>
                        Back
                    </button>
                )}
                <button type="button" onClick={onCancel ?? onClose}>
                    Cancel
                </button>
                <button type="button" onClick={onConfirm} disabled={confirmDisabled}>
                    {confirmLabel}
                </button>
            </div>
        ) : null,
}));

vi.mock('../../hooks/use-execute-process', () => ({
    useExecuteProcess: () => ({ executeProcess: mocks.executeProcess }),
}));

vi.mock('../ProcessTypeStep', () => ({
    ProcessTypeStep: ({ control }: { control: React.ComponentProps<typeof Controller>['control'] }) => (
        <Controller
            name="processType"
            control={control}
            render={({ field }) => (
                <select aria-label="Process type" {...field}>
                    <option value="">Select a process type</option>
                    {PROCESS_CONFIG_TYPES.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.label}
                        </option>
                    ))}
                </select>
            )}
        />
    ),
}));

vi.mock('../ProcessConfigStep', () => ({
    ProcessConfigStep: () => {
        const { setValue } = useFormContext();

        return (
            <button
                type="button"
                onClick={() =>
                    setValue('processConfig', [{ id: 'config-1', name: 'Configuration' }], { shouldValidate: true })
                }
            >
                Select configuration
            </button>
        );
    },
}));

vi.mock('../CaseStep', () => ({
    CaseStep: () => {
        const { setValue } = useFormContext();

        return (
            <button
                type="button"
                onClick={() => setValue('case', [{ id: 'case-1', name: 'Case' }], { shouldValidate: true })}
            >
                Select case
            </button>
        );
    },
}));

function renderDialog(onClose = vi.fn(), onLaunch = vi.fn()) {
    return render(
        <IntlProvider locale="en" messages={messagesEn}>
            <ExecuteProcessConfigDialog open onClose={onClose} onLaunch={onLaunch} />
        </IntlProvider>
    );
}

beforeEach(() => {
    vi.clearAllMocks();
    mocks.executeProcess.mockResolvedValue('execution-1');
});

describe('ExecuteProcessConfigDialog', () => {
    it('validates each step and launches the selected process', async () => {
        const onLaunch = vi.fn();
        renderDialog(undefined, onLaunch);

        const nextButton = () => screen.getByRole('button', { name: messagesEn.next });

        expect(nextButton()).toBeDisabled();

        fireEvent.change(screen.getByRole('combobox', { name: 'Process type' }), {
            target: { value: PROCESS_CONFIG_TYPES[0].id },
        });
        expect(nextButton()).toBeEnabled();

        fireEvent.click(nextButton());
        await waitFor(() => expect(screen.getByRole('button', { name: 'Select configuration' })).toBeInTheDocument());
        expect(nextButton()).toBeDisabled();

        fireEvent.click(screen.getByRole('button', { name: 'Select configuration' }));
        await waitFor(() => expect(nextButton()).toBeEnabled());
        fireEvent.click(nextButton());

        await waitFor(() => expect(screen.getByRole('button', { name: 'Select case' })).toBeInTheDocument());
        const launchButton = () => screen.getByRole('button', { name: messagesEn.launch });
        expect(launchButton()).toBeDisabled();

        fireEvent.click(screen.getByRole('button', { name: 'Select case' }));
        await waitFor(() => expect(launchButton()).toBeEnabled());
        fireEvent.click(launchButton());

        await waitFor(() =>
            expect(mocks.executeProcess).toHaveBeenCalledWith(
                expect.objectContaining({
                    processType: PROCESS_CONFIG_TYPES[0].id,
                    processConfig: [{ id: 'config-1', name: 'Configuration' }],
                    case: [{ id: 'case-1', name: 'Case' }],
                })
            )
        );
        expect(onLaunch).toHaveBeenCalledWith('execution-1');
        expect(screen.getByRole('combobox', { name: 'Process type' })).toHaveValue('');
    });
});

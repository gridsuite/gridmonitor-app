/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { screen, waitFor } from '@testing-library/react';
import { useFormContext } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from 'test-utils/msw/server';
import { renderWithProviders } from 'test-utils/render-with-providers';
import { ExecuteProcessConfigDialog, type ExecuteProcessConfigFormData } from '../ExecuteProcessConfigDialog';

vi.mock('@gridsuite/commons-ui', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@gridsuite/commons-ui')>()),
    DirectoryItemsInput: ({ name }: { name: 'case' | 'processConfig' }) => {
        const { setValue } = useFormContext<ExecuteProcessConfigFormData>();
        return (
            <button
                type="button"
                onClick={() =>
                    setValue(name, [{ id: name === 'case' ? 'case-1' : 'config-1', name: 'Selected item' }], {
                        shouldValidate: true,
                    })
                }
            >
                Select {name}
            </button>
        );
    },
}));

async function completeSteps(user: ReturnType<typeof renderWithProviders>['user']) {
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Loadflow' }));
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    await user.click(await screen.findByRole('button', { name: 'Select processConfig' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('button', { name: 'Run' })).toBeDisabled();
    await user.click(await screen.findByRole('button', { name: 'Select case' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Run' })).toBeEnabled());
}

describe('ExecuteProcessConfigDialog', () => {
    it('validates each step, sends the selected IDs and blocks duplicate launches while pending', async () => {
        const response = Promise.withResolvers<void>();
        const requests: URL[] = [];
        server.use(
            http.post('*/v1/execute', async ({ request }) => {
                requests.push(new URL(request.url));
                await response.promise;
                return HttpResponse.json('execution-1');
            })
        );
        const onLaunch = vi.fn();
        const { user } = renderWithProviders(<ExecuteProcessConfigDialog open onClose={vi.fn()} onLaunch={onLaunch} />);
        await completeSteps(user);
        const launch = screen.getByRole('button', { name: 'Run' });
        await user.click(launch);
        await waitFor(() => expect(requests).toHaveLength(1));
        expect(launch).toBeDisabled();
        await user.keyboard('{Enter}');
        expect(requests).toHaveLength(1);
        expect(Object.fromEntries(requests[0].searchParams)).toEqual({
            caseUuid: 'case-1',
            processConfigUuid: 'config-1',
            isDebug: 'true',
        });
        expect(onLaunch).not.toHaveBeenCalled();
        response.resolve();
        await waitFor(() => expect(onLaunch).toHaveBeenCalledWith('execution-1'));
        expect(await screen.findByRole('button', { name: 'Next' })).toBeDisabled();
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });
});

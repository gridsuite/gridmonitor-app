/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { createTestContext } from 'test-utils/create-test-context';
import { server } from 'test-utils/msw/server';
import ProcessExecutePage from '../../pages/ProcessExecutePage';

describe('ProcessExecutePage', () => {
    it('submits the form and displays the success message', async () => {
        server.use(
            http.post('*/v1/execute', () => {
                return HttpResponse.json('execution-id');
            })
        );

        const user = userEvent.setup();
        const { wrapper } = createTestContext();

        render(<ProcessExecutePage />, { wrapper });

        await user.type(screen.getByLabelText('Case UUID'), 'case-uuid');
        await user.type(screen.getByLabelText('Process Config UUID'), 'process-config-uuid');

        await user.click(screen.getByRole('button', { name: 'Execute process' }));

        await waitFor(() => {
            expect(screen.getByText('Newly created execution ID : execution-id')).toBeInTheDocument();
        });
    });

    it('displays the loading message while the request is pending', async () => {
        server.use(
            http.post('*/v1/execute', async () => {
                await new Promise((resolve) => {
                    setTimeout(resolve, 50);
                });

                return HttpResponse.json('execution-id');
            })
        );

        const user = userEvent.setup();
        const { wrapper } = createTestContext();

        render(<ProcessExecutePage />, { wrapper });

        await user.type(screen.getByLabelText('Case UUID'), 'case-uuid');
        await user.type(screen.getByLabelText('Process Config UUID'), 'process-config-uuid');

        await user.click(screen.getByRole('button', { name: 'Execute process' }));

        expect(screen.getByRole('alert')).toHaveTextContent('Starting...');
    });

    it('displays the error message when the request fails', async () => {
        server.use(http.post('*/v1/execute', () => HttpResponse.error()));

        const user = userEvent.setup();
        const { wrapper } = createTestContext();

        render(<ProcessExecutePage />, { wrapper });

        await user.type(screen.getByLabelText('Case UUID'), 'case-uuid');
        await user.type(screen.getByLabelText('Process Config UUID'), 'process-config-uuid');

        await user.click(screen.getByRole('button', { name: 'Execute process' }));

        await waitFor(() => {
            expect(screen.getByText('Failed to execute process.')).toBeInTheDocument();
        });
    });

    it('shows validation errors and prevent API call when submitting empty form', async () => {
        const spy = vi.fn();

        server.use(http.post('*/v1/execute', spy));

        const user = userEvent.setup();
        render(<ProcessExecutePage />, {
            wrapper: createTestContext().wrapper,
        });

        await user.click(screen.getByRole('button', { name: 'Execute process' }));

        const invalidFields = document.querySelectorAll('[aria-invalid="true"]');
        expect(invalidFields.length).toBe(2);

        expect(spy).not.toHaveBeenCalled();
    });
});

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { createTestContext } from 'test-utils/create-test-context';
import { server } from 'test-utils/msw/server';
import ProcessStepInfosPage from '../../pages/ProcessStepInfosPage';

describe('ProcessStepInfosPage', () => {
    it('displays process step information successfully', async () => {
        server.use(
            http.get('*/v1/executions/execution-1/step-infos', () =>
                HttpResponse.json([
                    {
                        id: 'step-2',
                        stepOrder: 2,
                        stepType: 'RESULT_EXPORT',
                        status: 'COMPLETED',
                    },
                    {
                        id: 'step-1',
                        stepOrder: 1,
                        stepType: 'LOADFLOW',
                        status: 'RUNNING',
                    },
                ])
            )
        );

        const user = userEvent.setup();
        const { wrapper } = createTestContext();

        render(
            <MemoryRouter initialEntries={['/process/results/execution-1/step-infos']}>
                <Routes>
                    <Route path="/process/results/:id/step-infos" element={<ProcessStepInfosPage />} />
                </Routes>
            </MemoryRouter>,
            { wrapper }
        );

        await waitFor(() => {
            expect(screen.getByText('Process Step Information')).toBeInTheDocument();
        });

        expect(screen.getByText('2 steps for execution execution-1.')).toBeInTheDocument();
        expect(screen.getByText('Step 1')).toBeInTheDocument();
        expect(screen.getByText('Step 2')).toBeInTheDocument();

        await user.click(screen.getAllByRole('button', { name: 'Show raw data' })[0]);

        expect(screen.getByText(/"id": "step-2"/)).toBeInTheDocument();
    });

    it('displays the loading state', async () => {
        server.use(
            http.get('*/v1/executions/execution-1/step-infos', async () => {
                await new Promise((resolve) => {
                    setTimeout(resolve, 50);
                });

                return HttpResponse.json([]);
            })
        );

        const { wrapper } = createTestContext();

        render(
            <MemoryRouter initialEntries={['/process/results/execution-1/step-infos']}>
                <Routes>
                    <Route path="/process/results/:id/step-infos" element={<ProcessStepInfosPage />} />
                </Routes>
            </MemoryRouter>,
            { wrapper }
        );

        expect(screen.getByText('Loading process step information...')).toBeInTheDocument();
    });

    it('displays the error state', async () => {
        server.use(http.get('*/v1/executions/execution-1/step-infos', () => HttpResponse.error()));

        const { wrapper } = createTestContext();

        render(
            <MemoryRouter initialEntries={['/process/results/execution-1/step-infos']}>
                <Routes>
                    <Route path="/process/results/:id/step-infos" element={<ProcessStepInfosPage />} />
                </Routes>
            </MemoryRouter>,
            { wrapper }
        );

        await waitFor(() => {
            expect(screen.getByText('Unable to load process step information.')).toBeInTheDocument();
        });
    });
});

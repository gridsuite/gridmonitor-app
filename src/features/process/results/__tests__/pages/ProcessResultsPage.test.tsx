/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { createTestContext } from 'test-utils/create-test-context';
import { server } from 'test-utils/msw/server';
import ProcessResultsPage from '../../pages/ProcessResultsPage';
import { PROCESS_PATHS } from '../../../router/process-paths';

describe('ProcessResultsPage', () => {
    it('displays process executions successfully', async () => {
        server.use(
            http.get('*/v1/executions', () =>
                HttpResponse.json([
                    {
                        id: 'execution-1',
                        startedAt: '2026-01-01T10:00:00Z',
                        completedAt: '2026-01-01T10:05:00Z',
                    },
                ])
            )
        );

        const { wrapper } = createTestContext();

        render(
            <MemoryRouter>
                <ProcessResultsPage />
            </MemoryRouter>,
            { wrapper }
        );

        await waitFor(() => {
            expect(screen.getByText('Process executions ids')).toBeInTheDocument();
        });

        expect(screen.getByText('Id :')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'execution-1' })).toBeInTheDocument();

        expect(screen.getByRole('link', { name: 'execution-1' })).toHaveAttribute(
            'href',
            PROCESS_PATHS.stepInfos('execution-1')
        );
    });

    it('displays the loading state', async () => {
        server.use(
            http.get('*/v1/executions', async () => {
                await new Promise((resolve) => {
                    setTimeout(resolve, 50);
                });

                return HttpResponse.json([]);
            })
        );

        const { wrapper } = createTestContext();

        render(
            <MemoryRouter>
                <ProcessResultsPage />
            </MemoryRouter>,
            { wrapper }
        );

        expect(screen.getByText('Loading process executions...')).toBeInTheDocument();
    });

    it('displays the error state', async () => {
        server.use(http.get('*/v1/executions', () => HttpResponse.error()));

        const { wrapper } = createTestContext();

        render(
            <MemoryRouter>
                <ProcessResultsPage />
            </MemoryRouter>,
            { wrapper }
        );

        await waitFor(() => {
            expect(screen.getByText('Unable to load process executions.')).toBeInTheDocument();
        });
    });
});

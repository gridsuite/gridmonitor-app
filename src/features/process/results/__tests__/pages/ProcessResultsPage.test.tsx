/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { screen, waitFor } from '@testing-library/react';
import { Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { renderWithProviders } from 'test-utils/render-with-providers';
import { server } from 'test-utils/msw/server';
import ProcessResultsPage from '../../pages/ProcessResultsPage';
import ProcessExecutionPage from '../../pages/ProcessExecutionPage';

const execution = {
    id: 'execution-1',
    type: 'SECURITY_ANALYSIS',
    status: 'FAILED',
    scheduledAt: '2026-01-01T09:55:00Z',
    startedAt: '2026-01-01T10:00:00Z',
    completedAt: '2026-01-01T10:05:00Z',
};

describe('ProcessResultsPage', () => {
    it('displays execution data and opens the selected execution details', async () => {
        server.use(http.get('*/v1/executions', () => HttpResponse.json([execution])));
        renderWithProviders(
            <Routes>
                <Route path="/" element={<ProcessResultsPage />} />
                <Route path="/process/results/:id" element={<ProcessExecutionPage />} />
            </Routes>
        );
        expect(await screen.findByText('Security analysis')).toBeVisible();
        expect(screen.getByRole('link', { name: 'Failed' })).toBeVisible();
        expect(screen.getByRole('columnheader', { name: /^Status/ })).toBeInTheDocument();
    });

    it('shows loading until the request resolves, then shows the empty state', async () => {
        const response = Promise.withResolvers<void>();
        server.use(
            http.get('*/v1/executions', async () => {
                await response.promise;
                return HttpResponse.json([]);
            })
        );
        renderWithProviders(<ProcessResultsPage />);
        expect(screen.getByText('Loading process executions...')).toBeVisible();
        response.resolve();
        expect(await screen.findByText('No process executions found.')).toBeVisible();
        expect(screen.queryByText('Loading process executions...')).not.toBeInTheDocument();
    });

    it('displays the error state', async () => {
        server.use(http.get('*/v1/executions', () => HttpResponse.error()));
        renderWithProviders(<ProcessResultsPage />);
        expect(await screen.findByText('Unable to load process executions.')).toBeVisible();
    });

    it('refreshes the execution status', async () => {
        server.use(http.get('*/v1/executions', () => HttpResponse.json([execution])));
        const { user } = renderWithProviders(<ProcessResultsPage />);
        expect(await screen.findByRole('link', { name: 'Failed' })).toBeVisible();
        server.use(http.get('*/v1/executions', () => HttpResponse.json([{ ...execution, status: 'COMPLETED' }])));
        await user.click(screen.getByRole('button', { name: 'Refresh' }));
        expect(await screen.findByRole('link', { name: 'Finished' })).toBeVisible();
        await waitFor(() => expect(screen.queryByRole('link', { name: 'Failed' })).not.toBeInTheDocument());
    });
});

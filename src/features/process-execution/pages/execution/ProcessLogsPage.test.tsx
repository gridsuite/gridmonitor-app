/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router';
import { expect, vi, afterEach, describe, it } from 'vitest';
import { renderWithProviders } from '../../../../test-utils/render-with-providers';
import ProcessLogsPage from './ProcessLogsPage';

const useProcessLogsMock = vi.hoisted(() => vi.fn());

vi.mock('../../logs/hooks/use-process-logs', () => ({
    useProcessLogs: useProcessLogsMock,
}));

vi.mock('../../logs/ProcessReportViewerProvider', () => ({
    ProcessReportViewerProvider: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="report-viewer-provider">{children}</div>
    ),
}));

vi.mock('@gridsuite/commons-ui', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@gridsuite/commons-ui')>();

    return {
        ...actual,
        ReportViewer: () => <div data-testid="report-viewer" />,
    };
});

function renderLogsPage(executionId = 'execution-1') {
    return renderWithProviders(
        <Routes>
            <Route path="/process/results/:id/logs" element={<ProcessLogsPage />} />
        </Routes>,
        {
            initialEntries: [`/process/results/${executionId}/logs`],
        }
    );
}

describe('ProcessLogsPage', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('displays the loading state while logs are being fetched', () => {
        useProcessLogsMock.mockReturnValue({
            execution: undefined,
            report: undefined,
            severities: undefined,
            isError: false,
            isEmpty: false,
            isLoading: true,
        });

        renderLogsPage();

        expect(screen.getByText(/loading/i)).toBeVisible();
    });

    it('displays the empty state when no report is available', () => {
        useProcessLogsMock.mockReturnValue({
            execution: undefined,
            report: undefined,
            severities: undefined,
            isError: false,
            isEmpty: true,
            isLoading: false,
        });

        renderLogsPage();

        expect(screen.getByText(/no.*log|no.*report/i)).toBeVisible();
    });

    it('displays the error state when fetching logs fails', () => {
        useProcessLogsMock.mockReturnValue({
            execution: undefined,
            report: undefined,
            severities: undefined,
            isError: true,
            isEmpty: false,
            isLoading: false,
        });

        renderLogsPage();

        expect(screen.getByText(/unable to load process logs/i)).toBeVisible();
    });

    it('displays the execution information and report viewer when logs are available', () => {
        useProcessLogsMock.mockReturnValue({
            execution: {
                id: 'execution-1',
                type: 'LOADFLOW',
                status: 'COMPLETED',
            },
            report: {
                id: 'report-1',
                logs: [],
            },
            severities: [],
            isError: false,
            isEmpty: false,
            isLoading: false,
        });

        renderLogsPage();

        expect(screen.getByRole('link', { name: /process launch history/i })).toHaveAttribute(
            'href',
            '/process/results'
        );
        expect(screen.getByRole('link', { name: /loadflow/i })).toHaveAttribute('href', '/process/results/execution-1');
        expect(screen.getAllByRole('heading', { name: 'Logs' })[0]).toBeVisible();
        expect(screen.getByTestId('report-viewer-provider')).toBeVisible();
        expect(screen.getByTestId('report-viewer')).toBeVisible();
    });

    it('does not render the report viewer when the report is missing', () => {
        useProcessLogsMock.mockReturnValue({
            execution: {
                id: 'execution-1',
                type: 'LOADFLOW',
                status: 'COMPLETED',
            },
            report: undefined,
            severities: [],
            isError: false,
            isEmpty: true,
            isLoading: false,
        });

        renderLogsPage();

        expect(screen.getAllByRole('heading', { name: 'Logs' })[0]).toBeVisible();
        expect(screen.queryByTestId('report-viewer')).not.toBeInTheDocument();
    });
});

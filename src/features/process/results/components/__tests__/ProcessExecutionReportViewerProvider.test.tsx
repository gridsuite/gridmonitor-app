/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { screen, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import {
    ReportFetcherContext,
    ReportFilterContext,
    ReportType,
    useNotificationsListener,
    NotificationsUrlKeys,
} from '@gridsuite/commons-ui';
import { server } from '../../../../../test-utils/msw/server';
import { renderWithProviders } from '../../../../../test-utils/render-with-providers';
import { pagedLogsFixture } from '../../../../../test-utils/fixtures';
import { ProcessReportViewerProvider } from '../ProcessReportViewerProvider';

vi.mock('@gridsuite/commons-ui', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@gridsuite/commons-ui')>();
    return {
        ...actual,
        useNotificationsListener: vi.fn(),
    };
});

function TestConsumer() {
    const fetcher = useContext(ReportFetcherContext);
    const filter = useContext(ReportFilterContext);
    return (
        <div>
            <div data-testid="refresh-counter">{fetcher?.refreshCounter}</div>
            <div data-testid="page">{filter?.pagination.page}</div>
            <button
                type="button"
                data-testid="fetch-logs-btn"
                onClick={() => fetcher?.fetchLogs('report-1', [], '', ReportType.GLOBAL, 0, 10)}
            >
                Fetch Logs
            </button>
        </div>
    );
}

describe('ProcessReportViewerProvider', () => {
    let listenerCallback: ((event: MessageEvent) => void) | undefined;

    beforeEach(() => {
        vi.clearAllMocks();
        listenerCallback = undefined;

        vi.mocked(useNotificationsListener).mockImplementation((urlKey, options) => {
            if (urlKey === NotificationsUrlKeys.MONITOR) {
                listenerCallback = options.listenerCallbackMessage;
            }
        });
    });

    it('provides initial context values and increments refreshCounter on notification', async () => {
        const { user } = renderWithProviders(
            <ProcessReportViewerProvider>
                <TestConsumer />
            </ProcessReportViewerProvider>,
            { initialEntries: ['/process/results/execution-1/logs'] }
        );

        expect(screen.getByTestId('refresh-counter')).toHaveTextContent('0');
        expect(screen.getByTestId('page')).toHaveTextContent('0');

        act(() => {
            listenerCallback?.({
                data: JSON.stringify({
                    headers: {
                        updateType: 'PROCESS_STEP_UPDATED',
                        processExecutionId: 'execution-1',
                    },
                }),
            } as MessageEvent);
        });

        expect(screen.getByTestId('refresh-counter')).toHaveTextContent('1');
    });

    it('fetches logs when fetcher.fetchLogs is called', async () => {
        let fetchCalled = false;
        server.use(
            http.get('*/v1/executions/execution-1/logs', () => {
                fetchCalled = true;
                return HttpResponse.json(pagedLogsFixture());
            })
        );

        const { user } = renderWithProviders(
            <ProcessReportViewerProvider>
                <TestConsumer />
            </ProcessReportViewerProvider>,
            { initialEntries: ['/process/results/execution-1/logs'] }
        );

        await user.click(screen.getByTestId('fetch-logs-btn'));

        expect(fetchCalled).toBe(true);
    });

    it('does not increment refreshCounter for different execution ID', () => {
        renderWithProviders(
            <ProcessReportViewerProvider>
                <TestConsumer />
            </ProcessReportViewerProvider>,
            { initialEntries: ['/process/results/execution-1/logs'] }
        );

        act(() => {
            listenerCallback?.({
                data: JSON.stringify({
                    headers: {
                        updateType: 'PROCESS_STEP_UPDATED',
                        processExecutionId: 'execution-2',
                    },
                }),
            } as MessageEvent);
        });

        expect(screen.getByTestId('refresh-counter')).toHaveTextContent('0');
    });
});

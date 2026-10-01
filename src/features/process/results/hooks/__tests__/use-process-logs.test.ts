/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { HttpResponse, http } from 'msw';
import { renderHook, waitFor } from '@testing-library/react';
import { createTestProviders } from 'test-utils/render-with-providers';
import { useProcessLogs } from '../use-process-logs';
import { server } from '../../../../../test-utils/msw/server';

describe('useProcessLogs', () => {
    it('returns the execution, report and severities when all requests succeed', async () => {
        const execution = {
            id: 'execution-1',
            type: 'LOADFLOW',
            status: 'COMPLETED',
        };
        const report = {
            id: 'report-1',
            logs: [],
        };
        const severities = ['INFO', 'WARN', 'ERROR'];

        server.use(
            http.get('*/v1/executions/execution-1', () => HttpResponse.json(execution)),
            http.get('*/v1/executions/execution-1/reports', () => HttpResponse.json(report)),
            http.get('*/v1/executions/execution-1/reports/aggregated-severities', () => HttpResponse.json(severities))
        );

        const { wrapper } = createTestProviders();
        const { result } = renderHook(() => useProcessLogs('execution-1'), { wrapper });

        await waitFor(() => {
            expect(result.current.execution).toEqual(execution);
        });

        expect(result.current.report).toEqual(report);
        expect(result.current.severities).toEqual(severities);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(result.current.isEmpty).toBe(false);
    });

    it('reports loading while the report request is pending', async () => {
        let resolveReport!: (response: Response) => void;

        const reportResponse = new Promise<Response>((resolve) => {
            resolveReport = resolve;
        });

        server.use(
            http.get('*/v1/executions/execution-1', () =>
                HttpResponse.json({
                    id: 'execution-1',
                    type: 'LOADFLOW',
                    status: 'COMPLETED',
                })
            ),
            http.get('*/v1/executions/execution-1/reports', () => reportResponse),
            http.get('*/v1/executions/execution-1/reports/aggregated-severities', () => HttpResponse.json([]))
        );

        const { wrapper } = createTestProviders();
        const { result } = renderHook(() => useProcessLogs('execution-1'), { wrapper });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(true);
        });

        expect(result.current.isEmpty).toBe(false);
        expect(result.current.isError).toBe(false);

        resolveReport(HttpResponse.json({ id: 'report-1', logs: [] }));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });
    });

    it('reports an empty result when the execution exists but no report is returned', async () => {
        server.use(
            http.get('*/v1/executions/execution-1', () =>
                HttpResponse.json({
                    id: 'execution-1',
                    type: 'LOADFLOW',
                    status: 'COMPLETED',
                })
            ),
            http.get('*/v1/executions/execution-1/reports', () => new HttpResponse(null, { status: 204 })),
            http.get('*/v1/executions/execution-1/reports/aggregated-severities', () => HttpResponse.json([]))
        );

        const { wrapper } = createTestProviders();
        const { result } = renderHook(() => useProcessLogs('execution-1'), { wrapper });

        await waitFor(() => {
            expect(result.current.isEmpty).toBe(true);
        });

        expect(result.current.execution).toBeDefined();
        expect(result.current.report).toBeNull();
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(false);
    });

    it('reports an error when fetching the execution fails', async () => {
        server.use(
            http.get('*/v1/executions/execution-1', () => new HttpResponse(null, { status: 500 })),
            http.get('*/v1/executions/execution-1/reports', () => HttpResponse.json({ id: 'report-1' })),
            http.get('*/v1/executions/execution-1/reports/aggregated-severities', () => HttpResponse.json([]))
        );

        const { wrapper } = createTestProviders();
        const { result } = renderHook(() => useProcessLogs('execution-1'), { wrapper });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.execution).toBeUndefined();
        expect(result.current.isEmpty).toBe(false);
    });

    it('reports an error when fetching the report fails', async () => {
        server.use(
            http.get('*/v1/executions/execution-1', () =>
                HttpResponse.json({
                    id: 'execution-1',
                    type: 'LOADFLOW',
                    status: 'COMPLETED',
                })
            ),
            http.get('*/v1/executions/execution-1/reports', () => new HttpResponse(null, { status: 500 })),
            http.get('*/v1/executions/execution-1/reports/aggregated-severities', () => HttpResponse.json([]))
        );

        const { wrapper } = createTestProviders();
        const { result } = renderHook(() => useProcessLogs('execution-1'), { wrapper });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.isEmpty).toBe(true);
    });

    it('does not fetch data when the execution id is missing', async () => {
        const { wrapper } = createTestProviders();
        const { result } = renderHook(() => useProcessLogs(''), { wrapper });

        expect(result.current.execution).toBeUndefined();
        expect(result.current.report).toBeUndefined();
        expect(result.current.severities).toBeUndefined();
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isEmpty).toBe(true);
        expect(result.current.isError).toBe(false);
    });
});

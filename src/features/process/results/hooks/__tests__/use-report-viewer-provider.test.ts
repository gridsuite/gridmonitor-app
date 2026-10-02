/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { HttpResponse, http } from 'msw';
import { act, renderHook, waitFor } from '@testing-library/react';
import { expect, describe, it } from 'vitest';
import { PROCESS_EXECUTION, REPORT_SEVERITY, TableType, type FilterConfig, ReportType } from '@gridsuite/commons-ui';
import { createTestProviders } from 'test-utils/render-with-providers';
import { useReportViewerProvider, mapReportLogs } from '../use-report-viewer-provider';
import { server } from '../../../../../test-utils/msw/server';

describe('mapReportLogs', () => {
    it('returns an empty array when no report logs are provided', () => {
        expect(mapReportLogs()).toEqual([]);
        expect(mapReportLogs([])).toEqual([]);
    });

    it('uses default values for missing log fields', () => {
        const result = mapReportLogs([
            {
                severity: 'UNKNOWN_SEVERITY' as never,
            },
        ]);

        expect(result).toEqual([
            {
                message: '',
                severity: REPORT_SEVERITY.UNKNOWN.name,
                backgroundColor: REPORT_SEVERITY.UNKNOWN.colorName,
                depth: 0,
                parentId: '',
            },
        ]);
    });

    it('normalizes depths when the first log does not have the minimum depth', () => {
        const result = mapReportLogs([
            { message: 'First', depth: 5 },
            { message: 'Second', depth: 2 },
            { message: 'Third', depth: 7 },
        ]);

        expect(result.map(({ depth }) => depth)).toEqual([3, 0, 5]);
    });
});

describe('useReportViewerProvider', () => {
    it('returns the default pagination and persisted filters', () => {
        const filters = [{ column: 'severity', value: 'ERROR' }] as FilterConfig[];

        const { wrapper } = createTestProviders({
            state: {
                processResults: {
                    tableSort: {},
                    tableFilters: {
                        columnsFilters: {
                            [TableType.Logs]: {
                                [PROCESS_EXECUTION]: filters,
                            },
                        },
                    },
                    tables: { uuid: null },
                },
            },
        });

        const { result } = renderHook(() => useReportViewerProvider('execution-1'), { wrapper });

        expect(result.current.filters).toEqual(filters);
        expect(result.current.pagination).toEqual({
            page: 0,
            rowsPerPage: 30,
        });
    });

    it('returns empty logs when the execution id is missing', async () => {
        const { wrapper } = createTestProviders();
        const { result } = renderHook(() => useReportViewerProvider(undefined), { wrapper });

        await expect(
            result.current.fetchLogs('report-1', [], '', PROCESS_EXECUTION as ReportType, 0, 30)
        ).resolves.toEqual({
            content: [],
            totalElements: 0,
            totalPages: 0,
        });
    });

    it('returns empty matches when the execution id is missing', async () => {
        const { wrapper } = createTestProviders();
        const { result } = renderHook(() => useReportViewerProvider(undefined), { wrapper });

        await expect(
            result.current.fetchLogMatches('report-1', [], '', PROCESS_EXECUTION as ReportType, 'error', 30)
        ).resolves.toEqual([]);
    });

    it('fetches and maps logs with the expected request parameters', async () => {
        let requestUrl: URL | undefined;

        server.use(
            http.get('*/v1/executions/execution-1/logs', ({ request }) => {
                requestUrl = new URL(request.url);

                return HttpResponse.json({
                    content: [
                        {
                            message: 'Error message',
                            severity: REPORT_SEVERITY.ERROR.name,
                            depth: 3,
                            parentId: 'parent-1',
                        },
                    ],
                    totalElements: 1,
                    totalPages: 1,
                });
            })
        );

        const { wrapper } = createTestProviders();
        const { result } = renderHook(() => useReportViewerProvider('execution-1'), { wrapper });

        let logs;

        await act(async () => {
            logs = await result.current.fetchLogs(
                'report-1',
                [REPORT_SEVERITY.ERROR.name],
                'error',
                PROCESS_EXECUTION as ReportType,
                2,
                50
            );
        });

        expect(requestUrl?.searchParams.get('reportId')).toBe('report-1');
        expect(requestUrl?.searchParams.get('messageFilter')).toBe('error');
        expect(requestUrl?.searchParams.get('severityLevelsFilter')).toBe(REPORT_SEVERITY.ERROR.name);
        expect(requestUrl?.searchParams.get('page')).toBe('2');
        expect(requestUrl?.searchParams.get('size')).toBe('50');

        expect(logs).toEqual({
            content: [
                {
                    message: 'Error message',
                    severity: REPORT_SEVERITY.ERROR.name,
                    backgroundColor: REPORT_SEVERITY.ERROR.colorName,
                    depth: 0,
                    parentId: 'parent-1',
                },
            ],
            totalElements: 1,
            totalPages: 1,
        });
    });

    it('updates the logs filters', async () => {
        const { wrapper, store } = createTestProviders();
        const { result } = renderHook(() => useReportViewerProvider('execution-1'), { wrapper });

        const filters = [{ columns: 'severity', value: 'ERROR' }] as unknown as FilterConfig[];

        await act(async () => {
            result.current.updateFilters(filters);
        });

        await waitFor(() => {
            expect(
                store.getState().processResults.tableFilters.columnsFilters?.[TableType.Logs]?.[PROCESS_EXECUTION]
            ).toEqual(filters);
        });
    });

    it('changes pagination with a numeric rows per page value', async () => {
        const { wrapper } = createTestProviders();
        const { result } = renderHook(() => useReportViewerProvider('execution-1'), { wrapper });

        await act(async () => {
            result.current.changePagination({
                page: 2,
                rowsPerPage: 50,
            });
        });

        await waitFor(() => {
            expect(result.current.pagination).toEqual({
                page: 2,
                rowsPerPage: 50,
            });
        });
    });
});

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { ReportType } from '@gridsuite/commons-ui';
import { server } from '../../../../../test-utils/msw/server';
import { createTestProviders } from '../../../../../test-utils/render-with-providers';
import { useReportViewerProvider } from '../use-report-viewer-provider';

describe('useReportViewerProvider', () => {
    it('fetches logs via the fetchLogs callback', async () => {
        const mockLogs = {
            content: [{ message: 'Log 1', severity: 'INFO', depth: 0 }],
            totalElements: 1,
            totalPages: 1,
        };

        server.use(http.get('*/v1/executions/execution-1/logs', () => HttpResponse.json(mockLogs)));

        const { result } = renderHook(() => useReportViewerProvider('execution-1'), {
            wrapper: createTestProviders(),
        });

        const pagedLogs = await result.current.fetchLogs('report-1', [], '', ReportType.GLOBAL, 0, 10);

        expect(pagedLogs.content).toHaveLength(1);
        expect(pagedLogs.content[0].message).toBe('Log 1');
        expect(pagedLogs.totalElements).toBe(1);
    });

    it('fetches log matches via the fetchLogMatches callback', async () => {
        const mockMatches = [{ page: 1, rowIndex: 5 }];

        server.use(http.get('*/v1/executions/execution-1/logs/search', () => HttpResponse.json(mockMatches)));

        const { result } = renderHook(() => useReportViewerProvider('execution-1'), {
            wrapper: createTestProviders(),
        });

        const matches = await result.current.fetchLogMatches('report-1', [], '', ReportType.GLOBAL, 'search', 10);

        expect(matches).toEqual([{ page: 1, rowIndex: 5 }]);
    });

    it('returns empty data when executionId is missing', async () => {
        const { result } = renderHook(() => useReportViewerProvider(undefined), {
            wrapper: createTestProviders(),
        });

        const pagedLogs = await result.current.fetchLogs('report-1', [], '', ReportType.GLOBAL, 0, 10);
        const matches = await result.current.fetchLogMatches('report-1', [], '', ReportType.GLOBAL, 'search', 10);

        expect(pagedLogs.content).toEqual([]);
        expect(matches).toEqual([]);
    });
});

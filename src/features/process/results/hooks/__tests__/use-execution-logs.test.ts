/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../../../../test-utils/msw/server';
import { createTestProviders } from '../../../../../test-utils/render-with-providers';
import { executionFixture, reportFixture, severitiesFixture } from '../../../../../test-utils/fixtures';
import { useProcessLogs } from '../use-process-logs';

describe('useProcessLogs', () => {
    it('returns execution data, reports and severities when successful', async () => {
        const execution = executionFixture();
        const report = reportFixture();
        const severities = severitiesFixture();

        server.use(
            http.get('*/v1/executions/execution-1', () => HttpResponse.json(execution)),
            http.get('*/v1/executions/execution-1/reports', () => HttpResponse.json(report)),
            http.get('*/v1/executions/execution-1/reports/aggregated-severities', () => HttpResponse.json(severities))
        );

        const { result } = renderHook(() => useProcessLogs('execution-1'), {
            wrapper: createTestProviders(),
        });

        await waitFor(() => expect(result.current.execution).toEqual(execution));
        expect(result.current.report).toEqual(report);
        expect(result.current.severities).toEqual(severities);
    });

    it('returns empty data when execution ID is missing', () => {
        const { result } = renderHook(() => useProcessLogs(undefined), {
            wrapper: createTestProviders(),
        });

        expect(result.current.execution).toBeUndefined();
        expect(result.current.report).toBeUndefined();
        expect(result.current.severities).toBeUndefined();
    });

    it('handles server errors gracefully', async () => {
        server.use(http.get('*/v1/executions/execution-1', () => new HttpResponse(null, { status: 500 })));

        const { result } = renderHook(() => useProcessLogs('execution-1'), {
            wrapper: createTestProviders(),
        });

        await waitFor(() => expect(result.current.execution).toBeUndefined());
    });
});

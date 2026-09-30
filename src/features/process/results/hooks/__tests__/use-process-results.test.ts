/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { createTestContext } from 'test-utils/create-test-context';
import { server } from 'test-utils/msw/server';
import { useProcessResults } from '../use-process-results';

describe('useProcessResults', () => {
    it('fetches and returns process executions correctly', async () => {
        const mockExecutions = [
            {
                id: 'execution-1',
                type: 'LOADFLOW',
                status: 'COMPLETED',
                startedAt: '2026-01-01T10:00:00Z',
            },
        ];

        server.use(http.get('*/v1/executions', () => HttpResponse.json(mockExecutions)));

        const { wrapper } = createTestContext();
        const { result } = renderHook(() => useProcessResults(), { wrapper });

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.executions).toHaveLength(1);
        expect(result.current.executions[0].id).toBe('execution-1');
        expect(result.current.executions[0].startedAt).toBeInstanceOf(Date);
        expect(result.current.isEmpty).toBe(false);
    });

    it('handles empty results', async () => {
        server.use(http.get('*/v1/executions', () => HttpResponse.json([])));

        const { wrapper } = createTestContext();
        const { result } = renderHook(() => useProcessResults(), { wrapper });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.executions).toHaveLength(0);
        expect(result.current.isEmpty).toBe(true);
    });

    it('handles error state', async () => {
        server.use(http.get('*/v1/executions', () => HttpResponse.error()));

        const { wrapper } = createTestContext();
        const { result } = renderHook(() => useProcessResults(), { wrapper });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });
    });
});

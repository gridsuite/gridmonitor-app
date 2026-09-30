/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { renderHook, act } from '@testing-library/react';
import { NotificationsUrlKeys, useNotificationsListener } from '@gridsuite/commons-ui';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as monitorApi from '../../../shared/api/monitor-api';
import { createTestProviders } from '../../../test-utils/render-with-providers';
import { useProcessInvalidationsListener } from '../../notifications/use-process-invalidation-listener';

vi.mock('@gridsuite/commons-ui', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@gridsuite/commons-ui')>();
    return {
        ...actual,
        useNotificationsListener: vi.fn(),
    };
});

vi.mock('../../../shared/api/monitor-api', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../../../shared/api/monitor-api')>();
    return {
        ...actual,
        invalidateProcessExecutionsLists: vi.fn(),
        invalidateProcessExecutionReports: vi.fn(),
        invalidateProcessExecutionReportsSeverities: vi.fn(),
        invalidateProcessExecutionLogs: vi.fn(),
        invalidateProcessExecution: vi.fn(),
        invalidateProcessExecutionSteps: vi.fn(),
    };
});

describe('useProcessInvalidationListener', () => {
    let listenerCallback: ((event: MessageEvent) => void) | undefined;

    beforeEach(() => {
        vi.clearAllMocks();
        listenerCallback = undefined;
        vi.mocked(useNotificationsListener).mockImplementation((_urlKey, options) => {
            listenerCallback = options.listenerCallbackMessage;
        });
    });

    it('subscribes to MONITOR notifications and invalidates lists on update', () => {
        renderHook(() => useProcessInvalidationsListener(), {
            wrapper: createTestProviders(),
        });

        expect(useNotificationsListener).toHaveBeenCalledWith(NotificationsUrlKeys.MONITOR, expect.any(Object));

        act(() => {
            listenerCallback?.({
                data: JSON.stringify({
                    headers: { updateType: 'PROCESS_EXECUTION_UPDATED' },
                }),
            } as MessageEvent);
        });

        expect(monitorApi.invalidateProcessExecutionsLists).toHaveBeenCalled();
    });

    it('invalidates reports and logs on step update', () => {
        renderHook(() => useProcessInvalidationsListener(), {
            wrapper: createTestProviders(),
        });

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

        expect(monitorApi.invalidateProcessExecutionReports).toHaveBeenCalledWith(expect.any(Function), 'execution-1');
        expect(monitorApi.invalidateProcessExecutionLogs).toHaveBeenCalledWith(expect.any(Function), 'execution-1');
    });
});

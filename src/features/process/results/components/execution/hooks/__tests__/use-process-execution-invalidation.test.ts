/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { renderHook } from '@testing-library/react';
import { NotificationsUrlKeys, useNotificationsListener } from '@gridsuite/commons-ui';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { invalidateProcessExecution, invalidateProcessExecutionSteps } from 'shared/api/monitor-api';
import { NotificationType } from 'shared/api/monitor-api/monitor.notification.type';
import { createTestContext } from 'test-utils/create-test-context';
import { useProcessExecutionInvalidation } from '../use-process-execution-invalidation';

vi.mock('shared/api/monitor-api', async (importOriginal) => {
    const actual = await importOriginal<typeof import('shared/api/monitor-api')>();

    return {
        ...actual,
        invalidateProcessExecution: vi.fn(),
        invalidateProcessExecutionSteps: vi.fn(),
    };
});

vi.mock('@gridsuite/commons-ui', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@gridsuite/commons-ui')>();

    return {
        ...actual,
        useNotificationsListener: vi.fn(),
    };
});

describe('useProcessInvalidationListener', () => {
    let listenerCallbackMessages: Array<((event: MessageEvent) => void) | undefined>;

    beforeEach(() => {
        vi.clearAllMocks();
        listenerCallbackMessages = [];

        vi.mocked(useNotificationsListener).mockImplementation((_urlKey, options) => {
            listenerCallbackMessages.push(options.listenerCallbackMessage);
        });
    });

    function sendMessage(event: MessageEvent) {
        listenerCallbackMessages?.forEach((listenerCallbackMessage) => {
            listenerCallbackMessage?.(event);
        });
    }

    it('registers a notifications listener on the monitor channel', () => {
        const { wrapper } = createTestContext();

        expect(listenerCallbackMessages.length).toBe(0);
        renderHook(() => useProcessExecutionInvalidation({ executionId: 'execution-1' }), { wrapper });

        expect(useNotificationsListener).toHaveBeenCalledWith(NotificationsUrlKeys.MONITOR, {
            listenerCallbackMessage: expect.any(Function),
        });
        expect(listenerCallbackMessages.length).toBe(1);
    });

    it('invalidates process execution and steps when receiving a matching update type and executionId', () => {
        const { wrapper } = createTestContext();

        renderHook(() => useProcessExecutionInvalidation({ executionId: 'execution-1' }), { wrapper });
        renderHook(() => useProcessExecutionInvalidation({ executionId: 'execution-2' }), { wrapper });

        sendMessage({
            data: JSON.stringify({
                headers: {
                    updateType: NotificationType.PROCESS_EXECUTION_UPDATED,
                    processExecutionId: 'execution-1',
                },
            }),
        } as MessageEvent);

        sendMessage({
            data: JSON.stringify({
                headers: {
                    updateType: NotificationType.PROCESS_EXECUTION_UPDATED,
                    processExecutionId: 'execution-2',
                },
            }),
        } as MessageEvent);

        expect(invalidateProcessExecution).toHaveBeenNthCalledWith(1, expect.anything(), 'execution-1');
        expect(invalidateProcessExecution).toHaveBeenNthCalledWith(2, expect.anything(), 'execution-2');

        expect(invalidateProcessExecutionSteps).toHaveBeenNthCalledWith(1, expect.anything(), 'execution-1');
        expect(invalidateProcessExecutionSteps).toHaveBeenNthCalledWith(2, expect.anything(), 'execution-2');
    });

    it('does nothing when updateType is not matching', () => {
        const { wrapper } = createTestContext();

        renderHook(() => useProcessExecutionInvalidation({ executionId: 'execution-1' }), { wrapper });

        sendMessage({
            data: JSON.stringify({
                headers: {
                    updateType: 'unknown',
                },
            }),
        } as MessageEvent);

        expect(invalidateProcessExecution).not.toHaveBeenCalled();
        expect(invalidateProcessExecutionSteps).not.toHaveBeenCalled();
    });

    it('does nothing when updateType is missing', () => {
        const { wrapper } = createTestContext();

        renderHook(() => useProcessExecutionInvalidation({ executionId: 'execution-1' }), { wrapper });

        sendMessage({
            data: JSON.stringify({
                headers: {},
            }),
        } as MessageEvent);

        expect(invalidateProcessExecution).not.toHaveBeenCalled();
        expect(invalidateProcessExecutionSteps).not.toHaveBeenCalled();
    });

    it('throws on invalid JSON payloads', () => {
        const { wrapper } = createTestContext();

        renderHook(() => useProcessExecutionInvalidation({ executionId: 'execution-1' }), { wrapper });

        expect(() => {
            sendMessage({
                data: 'not-json',
            } as MessageEvent);
        }).toThrow(SyntaxError);

        expect(invalidateProcessExecution).not.toHaveBeenCalled();
        expect(invalidateProcessExecutionSteps).not.toHaveBeenCalled();
    });
});

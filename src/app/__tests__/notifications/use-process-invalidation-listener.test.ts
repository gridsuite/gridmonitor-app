/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { renderHook } from '@testing-library/react';
import { NotificationsUrlKeys, useNotificationsListener } from '@gridsuite/commons-ui';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { invalidateProcessExecutionsLists } from 'shared/api/monitor-api';
import { createTestContext } from 'test-utils/create-test-context';
import { useProcessInvalidationsListener } from '../../notifications/use-process-invalidation-listener';

vi.mock('shared/api/monitor-api', async (importOriginal) => {
    const actual = await importOriginal<typeof import('shared/api/monitor-api')>();

    return {
        ...actual,
        invalidateProcessExecutionsLists: vi.fn(),
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
    let listenerCallbackMessage: ((event: MessageEvent) => void) | undefined;

    beforeEach(() => {
        vi.clearAllMocks();
        listenerCallbackMessage = undefined;

        vi.mocked(useNotificationsListener).mockImplementation((_urlKey, options) => {
            listenerCallbackMessage = options.listenerCallbackMessage;
        });
    });

    it('registers a notifications listener on the monitor channel', () => {
        const { wrapper } = createTestContext();

        expect(listenerCallbackMessage).not.toBeDefined();
        renderHook(() => useProcessInvalidationsListener(), { wrapper });

        expect(useNotificationsListener).toHaveBeenCalledWith(NotificationsUrlKeys.MONITOR, {
            listenerCallbackMessage: expect.any(Function),
        });
        expect(listenerCallbackMessage).toBeDefined();
    });

    it('invalidates process execution lists when receiving a matching update type', () => {
        const { wrapper } = createTestContext();

        renderHook(() => useProcessInvalidationsListener(), { wrapper });

        listenerCallbackMessage?.({
            data: JSON.stringify({
                headers: { updateType: 'PROCESS_EXECUTION_UPDATED' },
            }),
        } as MessageEvent);

        expect(invalidateProcessExecutionsLists).toHaveBeenCalledTimes(1);
    });

    it('does nothing when updateType is not matching', () => {
        const { wrapper } = createTestContext();

        renderHook(() => useProcessInvalidationsListener(), { wrapper });

        listenerCallbackMessage?.({
            data: JSON.stringify({
                headers: {
                    updateType: 'unknown',
                },
            }),
        } as MessageEvent);

        expect(invalidateProcessExecutionsLists).not.toHaveBeenCalled();
    });

    it('does nothing when updateType is missing', () => {
        const { wrapper } = createTestContext();

        renderHook(() => useProcessInvalidationsListener(), { wrapper });

        listenerCallbackMessage?.({
            data: JSON.stringify({
                headers: {},
            }),
        } as MessageEvent);

        expect(invalidateProcessExecutionsLists).not.toHaveBeenCalled();
    });

    it('throws on invalid JSON payloads', () => {
        const { wrapper } = createTestContext();

        renderHook(() => useProcessInvalidationsListener(), { wrapper });

        expect(() => {
            listenerCallbackMessage?.({
                data: 'not-json',
            } as MessageEvent);
        }).toThrow(SyntaxError);
        expect(invalidateProcessExecutionsLists).not.toHaveBeenCalled();
    });
});

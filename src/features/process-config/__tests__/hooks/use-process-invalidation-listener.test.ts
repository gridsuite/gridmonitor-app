/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as monitorWs from 'shared/api/ws/monitor-ws';
import * as monitorApiModule from 'shared/api/monitor-api';
import { createTestContext } from 'test-utils/create-test-context';
import { useMonitorInvalidationsListener } from 'features/process-config/hooks/use-process-invalidation-listener';
import { connectMonitorNotificationsWs } from 'shared/api/ws/monitor-ws';

vi.spyOn(monitorWs, 'connectMonitorNotificationsWs').mockImplementation(vi.fn());
vi.spyOn(monitorApiModule, 'invalidateProcessExecutionsLists').mockImplementation(vi.fn());

describe('useMonitorInvalidationsListener', () => {
    let mockWs: ReturnType<typeof connectMonitorNotificationsWs>;

    beforeEach(() => {
        mockWs = {
            onmessage: null,
            onerror: null,
            close: vi.fn(),
        } as unknown as ReturnType<typeof connectMonitorNotificationsWs>;

        vi.mocked(connectMonitorNotificationsWs, { partial: true }).mockReturnValue(mockWs);

        vi.clearAllMocks();
    });

    it('connects websocket on mount', () => {
        const { wrapper } = createTestContext();

        renderHook(() => useMonitorInvalidationsListener(), { wrapper });

        expect(connectMonitorNotificationsWs).toHaveBeenCalled();
    });

    it('does not connect websocket when user is not authenticated', () => {
        const { wrapper } = createTestContext({ authentication: { user: null } });

        renderHook(() => useMonitorInvalidationsListener(), { wrapper });

        expect(connectMonitorNotificationsWs).not.toHaveBeenCalled();
    });

    it('invalidates process execution lists when receiving an update message', () => {
        const { wrapper } = createTestContext();

        renderHook(() => useMonitorInvalidationsListener(), { wrapper });

        mockWs.onmessage?.({
            data: JSON.stringify({
                headers: { updateType: 'PROCESS_EXECUTION_UPDATED' },
            }),
        } as MessageEvent);

        expect(monitorApiModule.invalidateProcessExecutionsLists).toHaveBeenCalledWith(expect.anything());
    });

    it('closes websocket on unmount', () => {
        const { wrapper } = createTestContext();

        const { unmount } = renderHook(() => useMonitorInvalidationsListener(), { wrapper });

        unmount();

        expect(mockWs.close).toHaveBeenCalled();
    });
});

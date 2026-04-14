/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { renderHook } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { connectNotificationsWsUpdateConfig } from 'shared/api/ws/config-ws';
import { createTestContext } from 'test-utils/create-test-context';
import { useAppParametersInvalidationListener } from 'features/app-parameters/hooks/use-app-parameters-invalidation-listener';
import { invalidateConfigQueries } from 'shared/api/config-api/config-api';

vi.mock('shared/api/ws/config-ws', () => ({
    connectNotificationsWsUpdateConfig: vi.fn(),
}));

vi.mock('shared/api/config-api/config-api', () => ({
    invalidateConfigQueries: vi.fn(),
}));

describe('useAppParametersInvalidationListener', () => {
    let mockWs: {
        onmessage: ((event: MessageEvent) => void) | null;
        close: () => void;
    };

    beforeEach(() => {
        mockWs = {
            onmessage: null,
            close: vi.fn(),
        };

        vi.mocked(connectNotificationsWsUpdateConfig, { partial: true }).mockReturnValue(mockWs);

        vi.clearAllMocks();
    });

    it('connects websocket on mount', () => {
        const { wrapper } = createTestContext();

        renderHook(() => useAppParametersInvalidationListener(), { wrapper });

        expect(connectNotificationsWsUpdateConfig).toHaveBeenCalled();
    });

    it('invalidates config when receiving a message', () => {
        const { wrapper } = createTestContext();

        renderHook(() => useAppParametersInvalidationListener(), { wrapper });

        // simulate websocket message
        mockWs.onmessage?.({
            data: JSON.stringify({
                headers: { parameterName: 'theme' },
            }),
        } as MessageEvent);

        expect(invalidateConfigQueries).toHaveBeenCalledWith(expect.anything(), 'theme');
    });

    it('closes websocket on unmount', () => {
        const { wrapper } = createTestContext();

        const { unmount } = renderHook(() => useAppParametersInvalidationListener(), { wrapper });

        unmount();

        expect(mockWs.close).toHaveBeenCalled();
    });
});

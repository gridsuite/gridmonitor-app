/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as configWs from 'shared/api/ws/config-ws';
import { connectConfigNotificationsWs } from 'shared/api/ws/config-ws';
import { createBaseContext } from 'features/test-utils/create-base-context';
import * as configApiModule from 'shared/api/config-api/config-api';
import { useAppParametersInvalidationListener } from 'features/app-parameters/hooks/use-app-parameters-invalidation-listener';

vi.spyOn(configWs, 'connectConfigNotificationsWs').mockImplementation(vi.fn());
vi.spyOn(configApiModule, 'invalidateConfigQueries').mockImplementation(vi.fn());

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

        vi.mocked(connectConfigNotificationsWs, { partial: true }).mockReturnValue(mockWs);

        vi.clearAllMocks();
    });

    it('connects websocket on mount', () => {
        const { wrapper } = createBaseContext();

        renderHook(() => useAppParametersInvalidationListener({ isAuthenticated: true }), { wrapper });

        expect(connectConfigNotificationsWs).toHaveBeenCalled();
    });

    it('invalidates config when receiving a message', () => {
        const { wrapper } = createBaseContext();

        renderHook(() => useAppParametersInvalidationListener({ isAuthenticated: true }), { wrapper });

        // simulate websocket message
        mockWs.onmessage?.({
            data: JSON.stringify({
                headers: { parameterName: 'theme' },
            }),
        } as MessageEvent);

        expect(configApiModule.invalidateConfigQueries).toHaveBeenCalledWith(expect.anything(), 'theme');
    });

    it('closes websocket on unmount', () => {
        const { wrapper } = createBaseContext();

        const { unmount } = renderHook(() => useAppParametersInvalidationListener({ isAuthenticated: true }), {
            wrapper,
        });

        unmount();

        expect(mockWs.close).toHaveBeenCalled();
    });
});

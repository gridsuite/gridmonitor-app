/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    NotificationsUrlKeys,
    PREFIX_CONFIG_NOTIFICATION_WS,
    PREFIX_MONITOR_NOTIFICATION_WS,
} from '@gridsuite/commons-ui';
import { renderHook } from '@testing-library/react';
import { APP_NAME } from 'app/config/app-config';
import { useAppSelector } from 'app/store/store';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useNotificationsUrlGenerator } from 'shared/api/ws/use-notifications-url-generator';

vi.mock('app/store/store', () => ({
    useAppSelector: vi.fn(),
}));

describe('useNotificationsUrlGenerator', () => {
    let mockedUser: { id_token?: string } | null;

    beforeEach(() => {
        vi.clearAllMocks();
        mockedUser = { id_token: 'token-123' };
        Object.defineProperty(document, 'baseURI', {
            configurable: true,
            value: 'https://gridapp.test/',
        });
        vi.mocked(useAppSelector).mockImplementation(() => mockedUser);
    });

    it('returns an undefined config URL when the token is missing', () => {
        mockedUser = null;

        const { result } = renderHook(() => useNotificationsUrlGenerator());

        expect(result.current).toEqual({
            [NotificationsUrlKeys.CONFIG]: undefined,
            [NotificationsUrlKeys.MONITOR]: undefined,
        });
    });

    it('builds a secure websocket URL from an https base URI', () => {
        const { result } = renderHook(() => useNotificationsUrlGenerator());

        const expecteConfigUrl = new URL(
            `wss://gridapp.test/${PREFIX_CONFIG_NOTIFICATION_WS}/notify?appName=${APP_NAME}`
        );
        expecteConfigUrl.searchParams.set('access_token', 'token-123');

        const expecteMonitorUrl = new URL(
            `wss://gridapp.test/${PREFIX_MONITOR_NOTIFICATION_WS}/notify?appName=${APP_NAME}`
        );
        expecteMonitorUrl.searchParams.set('access_token', 'token-123');

        expect(result.current).toEqual({
            [NotificationsUrlKeys.CONFIG]: expecteConfigUrl.toString(),
            [NotificationsUrlKeys.MONITOR]: expecteMonitorUrl.toString(),
        });
    });
});

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
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useNotificationsUrlGenerator } from '../use-notifications-url-generator';
import * as configParams from '../../../config/config-params';

const APP_NAME = 'gridmonitor';
const TOKEN = 'token-123';

vi.mock('../../../config/config-params', () => ({
    getToken: vi.fn(),
    getAppName: vi.fn(),
}));

describe('useNotificationsUrlGenerator', () => {
    beforeEach(() => {
        Object.defineProperty(document, 'baseURI', {
            configurable: true,
            value: 'https://gridapp.test/',
        });
        vi.mocked(configParams.getToken).mockImplementation(() => TOKEN);
        vi.mocked(configParams.getAppName).mockImplementation(() => APP_NAME);
    });

    it('returns an undefined config URL when the token is missing', () => {
        vi.mocked(configParams.getToken).mockImplementation(() => undefined);

        const { result } = renderHook(() => useNotificationsUrlGenerator());

        expect(result.current).toEqual({
            [NotificationsUrlKeys.CONFIG]: undefined,
            [NotificationsUrlKeys.MONITOR]: undefined,
        });
    });

    it('builds a secure websocket URL from an https base URI', () => {
        const { result } = renderHook(() => useNotificationsUrlGenerator());

        const expectedConfigUrl = new URL(
            `wss://gridapp.test/${PREFIX_CONFIG_NOTIFICATION_WS}/notify?appName=${APP_NAME}`
        );
        expectedConfigUrl.searchParams.set('access_token', TOKEN);

        const expectedMonitorUrl = new URL(
            `wss://gridapp.test/${PREFIX_MONITOR_NOTIFICATION_WS}/notify?appName=${APP_NAME}`
        );
        expectedMonitorUrl.searchParams.set('access_token', TOKEN);

        expect(result.current).toEqual({
            [NotificationsUrlKeys.CONFIG]: expectedConfigUrl.toString(),
            [NotificationsUrlKeys.MONITOR]: expectedMonitorUrl.toString(),
        });
    });
});

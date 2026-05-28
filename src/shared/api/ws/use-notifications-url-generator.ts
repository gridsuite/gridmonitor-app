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
import { APP_NAME } from 'app/config/app-config';
import { selectUser } from 'features/authentication/store/authentication.selectors';
import { useAppSelector } from 'app/store/store';
import { useMemo } from 'react';

const getUrlWithToken = (baseUrl: string, tokenId?: string) => {
    if (!tokenId) {
        return undefined;
    }
    const url = new URL(baseUrl);
    url.searchParams.set('access_token', tokenId);
    return url.toString();
};

export const useNotificationsUrlGenerator = (): Partial<Record<NotificationsUrlKeys, string | undefined>> => {
    // The websocket API doesn't allow relative urls
    const webSocketBaseUrl = document.baseURI.replace(/^http:\/\//, 'ws://').replace(/^https:\/\//, 'wss://');
    const tokenId = useAppSelector(selectUser)?.id_token;

    // return a mapColumns with NOTIFICATIONS_URL_KEYS and undefined value if URL is not yet buildable (tokenId)
    // it will be used to register listeners as soon as possible.
    return useMemo(
        () => ({
            [NotificationsUrlKeys.CONFIG]: getUrlWithToken(
                `${webSocketBaseUrl}${PREFIX_CONFIG_NOTIFICATION_WS}/notify?${new URLSearchParams({
                    appName: APP_NAME,
                })}`,
                tokenId
            ),
            [NotificationsUrlKeys.MONITOR]: getUrlWithToken(
                `${webSocketBaseUrl}${PREFIX_MONITOR_NOTIFICATION_WS}/notify?${new URLSearchParams({
                    appName: APP_NAME,
                })}`,
                tokenId
            ),
        }),
        [tokenId, webSocketBaseUrl]
    );
};

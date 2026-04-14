/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ReconnectingWebSocket from 'reconnecting-websocket';
import { store } from 'app/store/store';
import { selectAuthentication } from 'features/authentication/store/authentication.selectors';
import { APP_NAME } from 'app/config/app-config';

const PREFIX_CONFIG_NOTIFICATION_WS = `${import.meta.env.VITE_WS_GATEWAY}/config-notification`;

function getToken(): string | null {
    const state = store.getState();
    return selectAuthentication(state).user?.id_token ?? null;
}

export function connectNotificationsWsUpdateConfig(): ReconnectingWebSocket {
    const webSocketBaseUrl = document.baseURI.replace(/^http:\/\//, 'ws://').replace(/^https:\/\//, 'wss://');
    const webSocketUrl = `${webSocketBaseUrl}${PREFIX_CONFIG_NOTIFICATION_WS}/notify?appName=${APP_NAME}`;

    const reconnectingWebSocket = new ReconnectingWebSocket(() => `${webSocketUrl}&access_token=${getToken()}`);
    reconnectingWebSocket.onopen = () => {
        console.info(`Connected Websocket update config ui ${webSocketUrl} ...`);
    };
    return reconnectingWebSocket;
}

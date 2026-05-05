/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { APP_NAME } from 'app/config/app-config';
import { createReconnectingWebSocket } from './ws-client';

const PREFIX_MONITOR_NOTIFICATION_WS = `${import.meta.env.VITE_WS_GATEWAY}/monitor-notification`;

export function connectMonitorNotificationsWs() {
    return createReconnectingWebSocket({
        path: `${PREFIX_MONITOR_NOTIFICATION_WS}/notify`,
        queryParams: {
            appName: APP_NAME,
        },
        name: 'monitor-notifications',
    });
}

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useAppDispatch } from 'app/store/store';
import { useEffect } from 'react';
import { invalidateConfigQueries } from 'shared/api/config-api/config-api';
import { connectConfigNotificationsWs } from 'shared/api/ws/config-ws';

type ConfigNotificationData = {
    headers?: {
        parameterName?: string;
    };
};

export const useAppParametersInvalidationListener = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!isAuthenticated) {
            return undefined;
        }

        const ws = connectConfigNotificationsWs();
        ws.onmessage = (event) => {
            const eventData = JSON.parse(event.data) as ConfigNotificationData;
            if (eventData.headers?.parameterName) {
                invalidateConfigQueries(dispatch, eventData.headers.parameterName);
            }
        };
        ws.onerror = (event) => {
            console.error('Unexpected Notification WebSocket error', event);
        };

        return () => ws.close();
    }, [dispatch, isAuthenticated]);
};

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { invalidateConfigQueries } from 'shared/api/config-api';
import { connectConfigNotificationsWs } from 'shared/api/ws/config-ws';
import type { AnyAppDispatch } from 'shared/store/state.type';

type ConfigNotificationData = {
    headers?: {
        parameterName?: string;
    };
};

type UseAppParametersInvalidationListenerProps = {
    isAuthenticated: boolean;
};

export const useAppParametersInvalidationListener = ({
    isAuthenticated,
}: UseAppParametersInvalidationListenerProps) => {
    const dispatch = useDispatch<AnyAppDispatch>();

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

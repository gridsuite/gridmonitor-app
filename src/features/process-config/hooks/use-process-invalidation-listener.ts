/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { connectMonitorNotificationsWs } from 'shared/api/ws/monitor-ws';
import { invalidateProcessExecutionsLists } from 'shared/api/monitor-api';
import type { AnyAppDispatch } from 'shared/store/state.type';

type MonitorNotificationData = {
    headers?: {
        updateType?: string;
        processType?: string;
        processExecutionId?: string;
    };
};

type UseProcessInvalidationListenerProps = {
    isAuthenticated: boolean;
};

export const useProcessInvalidationListener = ({ isAuthenticated }: UseProcessInvalidationListenerProps) => {
    const dispatch = useDispatch<AnyAppDispatch>();

    useEffect(() => {
        if (!isAuthenticated) {
            return undefined;
        }

        const ws = connectMonitorNotificationsWs();
        ws.onmessage = (event) => {
            const eventData = JSON.parse(event.data) as MonitorNotificationData;
            if (eventData.headers?.updateType === 'PROCESS_EXECUTION_UPDATED') {
                invalidateProcessExecutionsLists(dispatch);
            }
        };
        ws.onerror = (event) => {
            console.error('Unexpected Notification WebSocket error', event);
        };

        return () => ws.close();
    }, [dispatch, isAuthenticated]);
};

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect } from 'react';
import { useAppDispatch } from 'app/store/store';
import { connectMonitorNotificationsWs } from 'shared/api/ws/monitor-ws';
import { invalidateProcessExecutionsLists } from 'shared/api/monitor-api';

type MonitorNotificationData = {
    headers?: {
        updateType?: string;
        processType?: string;
        processExecutionId?: string;
    };
};

export const useProcessInvalidationsListener = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
    const dispatch = useAppDispatch();

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

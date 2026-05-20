/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { NotificationsUrlKeys, useNotificationsListener } from '@gridsuite/commons-ui';
import { useAppDispatch } from '../store/store';
import { invalidateProcessExecutionsLists, ProcessType } from '../../shared/api/monitor-api';

type MonitorNotificationData = {
    headers?: {
        updateType?: string;
        processType?: ProcessType;
        processExecutionId?: string;
    };
};

export const useProcessInvalidationsListener = () => {
    const dispatch = useAppDispatch();

    const invalidateProcess = (event: MessageEvent) => {
        const eventData = JSON.parse(event.data) as MonitorNotificationData;
        if (eventData.headers?.updateType === 'PROCESS_EXECUTION_UPDATED') {
            invalidateProcessExecutionsLists(dispatch);
        }
    };

    useNotificationsListener(NotificationsUrlKeys.MONITOR, {
        listenerCallbackMessage: invalidateProcess,
    });
};

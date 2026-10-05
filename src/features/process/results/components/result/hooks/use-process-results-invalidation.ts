/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useCallback } from 'react';
import { NotificationsUrlKeys, useNotificationsListener } from '@gridsuite/commons-ui';
import { useAppDispatch } from 'app/store/store';
import { invalidateProcessExecutionsLists } from 'shared/api/monitor-api';
import { isProcessExecutionUpdateNotification } from '../../../../../../shared/api/monitor-api/monitor.notification.type';

export const useProcessResultsInvalidation = () => {
    const dispatch = useAppDispatch();

    const onProcessExecutionUpdated = useCallback(
        (event: MessageEvent) => {
            const eventData = JSON.parse(event.data);
            if (isProcessExecutionUpdateNotification(eventData)) {
                invalidateProcessExecutionsLists(dispatch);
            }
        },
        [dispatch]
    );

    useNotificationsListener(NotificationsUrlKeys.MONITOR, {
        listenerCallbackMessage: onProcessExecutionUpdated,
    });
};

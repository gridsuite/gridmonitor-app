/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from 'react';
import { NotificationsUrlKeys, useNotificationsListener } from '@gridsuite/commons-ui';
import {
    invalidateProcessExecution,
    invalidateProcessExecutionReports,
    invalidateProcessExecutionReportsSeverities,
    invalidateProcessExecutionsLists,
    invalidateProcessExecutionSteps,
    isProcessExecutionUpdateNotification,
} from 'shared/api/monitor-api';

import { useAppDispatch } from '../store/hooks';

export const useProcessInvalidationsListener = () => {
    const dispatch = useAppDispatch();

    const invalidateProcess = useCallback(
        (event: MessageEvent) => {
            const eventData = JSON.parse(event.data);
            if (isProcessExecutionUpdateNotification(eventData)) {
                invalidateProcessExecutionsLists(dispatch);
                if (eventData.headers?.processExecutionId) {
                    invalidateProcessExecution(dispatch, eventData.headers.processExecutionId);
                    invalidateProcessExecutionSteps(dispatch, eventData.headers.processExecutionId);
                    invalidateProcessExecutionReports(dispatch, eventData.headers.processExecutionId);
                    invalidateProcessExecutionReportsSeverities(dispatch, eventData.headers.processExecutionId);
                }
            }
        },
        [dispatch]
    );

    useNotificationsListener(NotificationsUrlKeys.MONITOR, {
        listenerCallbackMessage: invalidateProcess,
    });
};

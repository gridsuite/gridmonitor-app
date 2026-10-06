/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useCallback } from 'react';
import { NotificationsUrlKeys, useNotificationsListener } from '@gridsuite/commons-ui';
import { useAppDispatch } from 'app/store/store';
import {
    invalidateProcessExecution,
    invalidateProcessExecutionReports,
    invalidateProcessExecutionReportsSeverities,
} from 'shared/api/monitor-api';
import { isProcessExecutionUpdateNotification } from 'shared/api/monitor-api/monitor.notification.type';

export function useProcessLogsInvalidation({
    executionId,
    onInvalidate,
}: Readonly<{ executionId?: string; onInvalidate: () => void }>) {
    const dispatch = useAppDispatch();

    const onProcessExecutionUpdated = useCallback(
        (event: MessageEvent) => {
            const eventData = JSON.parse(event.data);
            if (
                isProcessExecutionUpdateNotification(eventData) &&
                eventData.headers.processExecutionId === executionId
            ) {
                invalidateProcessExecution(dispatch, eventData.headers.processExecutionId); // update execution status
                invalidateProcessExecutionReports(dispatch, eventData.headers.processExecutionId);
                invalidateProcessExecutionReportsSeverities(dispatch, eventData.headers.processExecutionId);
                onInvalidate?.();
            }
        },
        [dispatch, executionId, onInvalidate]
    );

    useNotificationsListener(NotificationsUrlKeys.MONITOR, {
        listenerCallbackMessage: executionId ? onProcessExecutionUpdated : undefined,
    });
}

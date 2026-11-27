/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ProcessType } from './monitor.generated';

export enum NotificationType {
    PROCESS_EXECUTION_UPDATED = 'PROCESS_EXECUTION_UPDATED',
    AUTOMATIC_PROCESS_CONFIG_UPDATED = 'AUTOMATIC_PROCESS_CONFIG_UPDATED',
}

// EventData

export type MonitorExecutionEventData = {
    headers: {
        updateType: NotificationType;
        processType: ProcessType;
        processExecutionId: string;
    };
    payload?: unknown;
};

export type MonitorAutomaticProcessConfigEventData = {
    headers: {
        updateType: NotificationType;
    };
    payload?: unknown;
};

// Predicates

export function isProcessExecutionUpdateNotification(notif: any): notif is MonitorExecutionEventData {
    return notif?.headers?.updateType === NotificationType.PROCESS_EXECUTION_UPDATED;
}

export function isAutomaticProcessConfigUpdateNotification(
    notif: any
): notif is MonitorAutomaticProcessConfigEventData {
    return notif?.headers?.updateType === NotificationType.AUTOMATIC_PROCESS_CONFIG_UPDATED;
}

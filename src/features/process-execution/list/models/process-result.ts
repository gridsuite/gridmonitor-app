/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { ProcessExecution, ProcessExecutionStep } from '../../../../shared/api/monitor-api';

export type ProcessStepModel = Omit<ProcessExecutionStep, 'startedAt' | 'completedAt'> & {
    startedAt?: Date;
    completedAt?: Date;
};

export type ProcessExecutionInfos = Omit<ProcessExecution, 'startedAt' | 'completedAt' | 'scheduledAt'> & {
    startedAt?: Date;
    completedAt?: Date;
    scheduledAt?: Date;
};

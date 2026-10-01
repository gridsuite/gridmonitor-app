/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { monitorGeneratedApi } from './monitor.generated';
import { MonitorTags } from './monitor-base-api';
import type { AppDispatch } from '../../../app/store/store';

export const monitorApi = monitorGeneratedApi.enhanceEndpoints({
    endpoints: {
        getProcessExecutions: {
            providesTags: [{ type: MonitorTags.ProcessExecutions, id: 'LIST' }],
        },
        getExecution: {
            providesTags: (_result, _error, queryArg) => [
                { type: MonitorTags.ProcessExecution, id: queryArg.executionId },
            ],
        },
        getStepsInfos: {
            providesTags: (_result, _error, queryArg) => [
                { type: MonitorTags.ProcessExecutionSteps, id: queryArg.executionId },
            ],
        },
        getExecutionReports: {
            providesTags: (result, error, { executionId }) => [
                { type: MonitorTags.ProcessExecutionReports, id: executionId },
            ],
        },
        getExecutionReportsSeverities: {
            providesTags: (result, error, { executionId }) => [
                { type: MonitorTags.ProcessExecutionReportsSeverities, id: executionId },
            ],
        },
    },
});

export const invalidateProcessExecutionsLists = (dispatch: AppDispatch) =>
    dispatch(monitorApi.util.invalidateTags([{ type: MonitorTags.ProcessExecutions, id: 'LIST' }]));

export const invalidateProcessExecution = (dispatch: AppDispatch, executionId: string) =>
    dispatch(monitorApi.util.invalidateTags([{ type: MonitorTags.ProcessExecution, id: executionId }]));

export const invalidateProcessExecutionReports = (dispatch: AppDispatch, processExecutionId: string) =>
    dispatch(monitorApi.util.invalidateTags([{ type: MonitorTags.ProcessExecutionReports, id: processExecutionId }]));

export const invalidateProcessExecutionReportsSeverities = (dispatch: AppDispatch, processExecutionId: string) =>
    dispatch(
        monitorApi.util.invalidateTags([
            { type: MonitorTags.ProcessExecutionReportsSeverities, id: processExecutionId },
        ])
    );

export const invalidateProcessExecutionSteps = (dispatch: AppDispatch, executionId: string) =>
    dispatch(monitorApi.util.invalidateTags([{ type: MonitorTags.ProcessExecutionSteps, id: executionId }]));

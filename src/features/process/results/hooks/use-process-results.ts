/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ProcessExecution, ProcessType, useGetLaunchedProcessesQuery } from 'shared/api/monitor-api';
import { ProcessExecutionInfos } from '../models/process-result';

export const mapStepsInfos = (api: ProcessExecution): ProcessExecutionInfos => ({
    ...api,
    startedAt: api.startedAt ? new Date(api.startedAt) : undefined,
    completedAt: api.completedAt ? new Date(api.completedAt) : undefined,
    scheduledAt: api.scheduledAt ? new Date(api.scheduledAt) : undefined,
});

export function useProcessResults() {
    const {
        data = [],
        isError,
        isLoading,
        isSuccess,
    } = useGetLaunchedProcessesQuery({
        processType: ProcessType.SecurityAnalysis,
    });

    const mappedData = data.map(mapStepsInfos);

    return {
        executions: mappedData,
        isEmpty: data.length === 0,
        isError,
        isLoading,
        isSuccess,
    };
}

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ProcessExecutionStep, useGetExecutionQuery, useGetStepsInfosQuery } from 'shared/api/monitor-api';
import { ProcessStepModel } from '../../../models/process-result';
import { useProcessExecutionInvalidation } from './use-process-execution-invalidation';

export const mapStepsInfos = (api: ProcessExecutionStep): ProcessStepModel => ({
    ...api,
    startedAt: api.startedAt ? new Date(api.startedAt) : undefined,
    completedAt: api.completedAt ? new Date(api.completedAt) : undefined,
});

export function useExecutionWithSteps(id?: string) {
    const executionId = id ?? '';
    const skip = !id;

    const {
        currentData: execution,
        isError: isExecutionError,
        isLoading: isExecutionLoading,
        isSuccess: isExecutionSuccess,
    } = useGetExecutionQuery({ executionId }, { skip, refetchOnMountOrArgChange: true });

    const {
        currentData: stepInfos = [],
        isError: isStepsError,
        isLoading: isStepsLoading,
        isSuccess: isStepsSuccess,
    } = useGetStepsInfosQuery({ executionId }, { skip, refetchOnMountOrArgChange: true });

    const steps = stepInfos.map(mapStepsInfos);

    useProcessExecutionInvalidation({ executionId: id });

    return {
        execution,
        steps,
        executionId: id,

        isEmpty: steps.length === 0,
        isMissingExecutionId: !id,

        isLoading: isExecutionLoading || isStepsLoading,
        isError: isExecutionError || isStepsError,
        isSuccess: isExecutionSuccess && isStepsSuccess,
    };
}

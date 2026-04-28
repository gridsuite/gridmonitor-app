/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useParams } from 'react-router';
import { ProcessExecutionStep, useGetStepsInfosQuery } from 'shared/api/monitor-api';
import { ProcessStepModel } from '../models/process-result';

export const mapStepsInfos = (api: ProcessExecutionStep): ProcessStepModel => ({
    ...api,
    startedAt: api.startedAt ? new Date(api.startedAt) : undefined,
    completedAt: api.completedAt ? new Date(api.completedAt) : undefined,
});

export function useProcessStepInfos() {
    const { id } = useParams<{ id: string }>();
    const {
        data = [],
        isError,
        isLoading,
        isSuccess,
    } = useGetStepsInfosQuery({ executionId: id ?? '' }, { skip: !id });

    const steps = data.map(mapStepsInfos);
    return {
        executionId: id,
        isEmpty: steps.length === 0,
        isError,
        isLoading,
        isMissingExecutionId: !id,
        isSuccess,
        steps,
    };
}

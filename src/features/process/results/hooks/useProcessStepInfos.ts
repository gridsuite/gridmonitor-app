/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useMemo } from 'react';
import { useParams } from 'react-router';
import { useGetStepsInfosQuery } from 'shared/api/monitor-api';

export function useProcessStepInfos() {
    const { id } = useParams<{ id: string }>();
    const {
        data = [],
        isError,
        isLoading,
        isSuccess,
    } = useGetStepsInfosQuery({ executionId: id ?? '' }, { skip: !id });

    const steps = useMemo(
        () =>
            [...data].sort((left, right) => {
                const leftOrder = left.stepOrder ?? Number.MAX_SAFE_INTEGER;
                const rightOrder = right.stepOrder ?? Number.MAX_SAFE_INTEGER;
                return leftOrder - rightOrder;
            }),
        [data]
    );

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

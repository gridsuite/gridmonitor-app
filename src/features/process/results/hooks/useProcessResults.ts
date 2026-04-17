/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ProcessType, useGetLaunchedProcessesQuery } from 'shared/api/monitor-api';

export function useProcessResults() {
    const {
        data = [],
        isError,
        isLoading,
        isSuccess,
    } = useGetLaunchedProcessesQuery({
        processType: ProcessType.SecurityAnalysis,
    });

    return {
        executions: data,
        isEmpty: data.length === 0,
        isError,
        isLoading,
        isSuccess,
    };
}

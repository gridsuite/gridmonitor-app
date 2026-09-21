/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from 'react';
import { ExecuteProcessApiArg, useExecuteProcessMutation } from 'shared/api/monitor-api';

export function toExecuteProcessApiArg(values: any): ExecuteProcessApiArg {
    return {
        caseUuid: values.case?.[0].id,
        processConfigUuid: values.processConfig?.[0].id,
        isDebug: values.debugMode,
    };
}

export function useExecuteProcess() {
    const [executeProcessMutation, mutationResult] = useExecuteProcessMutation();

    const executeProcess = useCallback(
        async (values: any) => {
            const result = await executeProcessMutation(toExecuteProcessApiArg(values)).unwrap();
            return result;
        },
        [executeProcessMutation]
    );

    return {
        executeProcess,
        isCreating: mutationResult.isLoading,
        isError: mutationResult.isError,
        error: mutationResult.error,
        createdConfigUuid: mutationResult.data,
    };
}

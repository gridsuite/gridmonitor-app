import { useCallback } from 'react';
import { ExecuteProcessApiArg, useExecuteProcessMutation } from 'shared/api/monitor-api';

export function toExecuteProcessApiArg(values): ExecuteProcessApiArg {
    return {
        caseUuid: values.case?.[0].id,
        processConfigUuid: values.processConfig?.[0].id,
        isDebug: values.debugMode,
    };
}

export function useExecuteProcess() {
    const [executeProcessMutation, mutationResult] = useExecuteProcessMutation();

    const executeProcess = useCallback(
        async (values) => {
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

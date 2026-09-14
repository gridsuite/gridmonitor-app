/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from 'react';
import {
    FieldConstants,
    getProcessConfigBackendFromFormData,
    getProcessConfigFormData,
    type FetchProcessConfigHandler,
    type ProcessConfigFormValues,
} from '@gridsuite/commons-ui';
import { useLazyGetProcessConfigQuery } from 'shared/api/monitor-api';
import { useCreateProcessConfigMutation, type CreateProcessConfigApiArg } from 'shared/api/explore-api';
import { UUID } from 'node:crypto';

export function toCreateProcessConfigApiArg(values: ProcessConfigFormValues): CreateProcessConfigApiArg {
    return {
        name: values[FieldConstants.NAME],
        description: values[FieldConstants.DESCRIPTION] ?? '',
        parentDirectoryUuid: values[FieldConstants.DIRECTORY]?.directoryItemId ?? '',
        body: getProcessConfigBackendFromFormData(values),
    };
}

export function useCreateProcessConfig() {
    const [createProcessConfigMutation, mutationResult] = useCreateProcessConfigMutation();

    const createProcessConfig = useCallback(
        async (values: ProcessConfigFormValues) => {
            const result = await createProcessConfigMutation(toCreateProcessConfigApiArg(values)).unwrap();
            return result;
        },
        [createProcessConfigMutation]
    );

    return {
        createProcessConfig,
        isCreating: mutationResult.isLoading,
        isError: mutationResult.isError,
        error: mutationResult.error,
        createdConfigUuid: mutationResult.data,
    };
}

export function useProcessConfigPrefill(): FetchProcessConfigHandler {
    const [getProcessConfig] = useLazyGetProcessConfigQuery();

    return useCallback<FetchProcessConfigHandler>(
        async (processConfigUuid: string) => {
            const { processConfig } = await getProcessConfig({ uuid: processConfigUuid }).unwrap();

            if (!processConfig) {
                return undefined;
            }

            return getProcessConfigFormData({ id: processConfigUuid as UUID, processConfig }, '', '');
        },
        [getProcessConfig]
    );
}

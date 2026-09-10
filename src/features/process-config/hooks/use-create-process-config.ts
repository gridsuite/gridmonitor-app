/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from 'react';
import { FieldConstants, getNamedProcessConfigFormData } from '@gridsuite/commons-ui';
import { ProcessType, type ProcessConfig, useLazyGetProcessConfigQuery } from 'shared/api/monitor-api';
import { useCreateProcessConfigMutation, type CreateProcessConfigApiArg } from 'shared/api/explore-api';
import { CreateProcessConfigFormValues, ProcessConfigPrefillValues } from '../types/processConfig.types';

function mapProcessConfig(values: CreateProcessConfigFormValues): ProcessConfig {
    const modifications = values.modifications.flatMap((modificationGroup) =>
        modificationGroup.modification.map((modification) => ({
            modificationUuid: modification.id,
            description: modificationGroup.description,
            active: modificationGroup.active,
        }))
    );

    switch (values.processType) {
        case ProcessType.Loadflow:
            return {
                processType: ProcessType.Loadflow,
                loadflowParametersUuid: values.loadflowParameters?.[0]?.id ?? '',
                modifications,
            };

        case ProcessType.SecurityAnalysis:
            return {
                processType: ProcessType.SecurityAnalysis,
                securityAnalysisParametersUuid: values.securityAnalysisParameters?.[0]?.id ?? '',
                loadflowParametersUuid: values.loadflowParameters?.[0]?.id ?? '',
                modifications,
            };

        case ProcessType.ShortCircuit:
            return {
                processType: ProcessType.ShortCircuit,
                shortCircuitParametersUuid: values.shortcircuitParameters?.[0]?.id ?? '',
                modifications,
            };

        default:
            throw new Error(`Unsupported process type: ${values.processType}`);
    }
}

export function toCreateProcessConfigApiArg(values: CreateProcessConfigFormValues): CreateProcessConfigApiArg {
    return {
        name: values[FieldConstants.NAME],
        description: values[FieldConstants.DESCRIPTION] ?? '',
        parentDirectoryUuid: values[FieldConstants.DIRECTORY]?.directoryItemId ?? '',
        body: mapProcessConfig(values),
    };
}

export function useCreateProcessConfig() {
    const [createProcessConfigMutation, mutationResult] = useCreateProcessConfigMutation();

    const createProcessConfig = useCallback(
        async (values: CreateProcessConfigFormValues) => {
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

export function useProcessConfigPrefill() {
    const [getProcessConfig] = useLazyGetProcessConfigQuery();
    return useCallback(
        async (processConfigUuid: string) => {
            const { processConfig } = await getProcessConfig({ uuid: processConfigUuid }).unwrap();

            if (!processConfig) {
                return undefined;
            }
            const config = await getNamedProcessConfigFormData(processConfig, '', '');
            return config as ProcessConfigPrefillValues;
        },
        [getProcessConfig]
    );
}

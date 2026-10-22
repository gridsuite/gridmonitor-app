/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type {
    FilterConfig,
    OverloadedEquipment,
    Page,
    SCAFaultResult,
    SecurityAnalysisNmkResult,
    SortConfig,
} from '@gridsuite/commons-ui';
import { useGetExecutionResultsQuery } from 'shared/api/monitor-api';
import { SHORT_CIRCUIT_RESULT_TYPES, type SecurityAnalysisResultType } from 'shared/api/monitor-api/result-subtypes';

export interface ExecutionResultsQuery {
    page?: number;
    size?: number;
    filters?: FilterConfig[];
    sort?: SortConfig[];
}

export interface LoadFlowExecutionResultsQuery extends ExecutionResultsQuery {
    resultType: string;
}

export interface SecurityAnalysisExecutionResultsQuery extends ExecutionResultsQuery {
    resultType: SecurityAnalysisResultType;
}

function useExecutionResults<Result>(
    executionId: string,
    enabled: boolean,
    { resultType, page = 0, size = 25, filters, sort }: ExecutionResultsQuery & { resultType: string }
) {
    const { currentData, isError, isFetching } = useGetExecutionResultsQuery(
        {
            executionId,
            resultType,
            page,
            size,
            sort: sort?.map(({ colId, sort: direction }) => `${colId},${direction}`),
            filters: filters?.length ? JSON.stringify(filters) : undefined,
        },
        { skip: !enabled }
    );

    const result = (currentData ?? undefined) as Result | undefined;

    return {
        result,
        isError: enabled && result === undefined && (isError || !isFetching),
        isFetching: enabled && result === undefined && isFetching,
    };
}

export function useLoadFlowExecutionResults(
    executionId: string,
    enabled: boolean,
    query: LoadFlowExecutionResultsQuery
) {
    return useExecutionResults<OverloadedEquipment[]>(executionId, enabled, query);
}

export function useSecurityAnalysisExecutionResults(
    executionId: string,
    enabled: boolean,
    query: SecurityAnalysisExecutionResultsQuery
) {
    return useExecutionResults<SecurityAnalysisNmkResult>(executionId, enabled, query);
}

export type AllBusesShortCircuitResult = Page<SCAFaultResult>;

export function useShortCircuitExecutionResults(
    executionId: string,
    enabled: boolean,
    query: ExecutionResultsQuery = {}
) {
    return useExecutionResults<AllBusesShortCircuitResult>(executionId, enabled, {
        ...query,
        resultType: SHORT_CIRCUIT_RESULT_TYPES.AllBuses,
    });
}

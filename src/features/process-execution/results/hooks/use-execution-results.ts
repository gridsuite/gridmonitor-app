/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useMemo } from 'react';
import type {
    FilterConfig,
    OverloadedEquipment,
    Page,
    SCAFaultResult,
    SecurityAnalysisNmkResult,
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

const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 25;

export function parseExecutionResult<Result>(raw?: string[]): Result | undefined {
    const serializedResult = raw?.[0];
    if (!serializedResult) {
        return undefined;
    }

    try {
        const result: unknown = JSON.parse(serializedResult);
        return result == null ? undefined : (result as Result);
    } catch {
        return undefined;
    }
}

function useParsedExecutionResults<Result>(
    executionId: string,
    enabled: boolean,
    query: ExecutionResultsQuery & { resultType: string }
) {
    const { currentData, isError, isFetching } = useGetExecutionResultsQuery(
        {
            executionId,
            resultType: query.resultType,
            pageable: {
                page: query.page ?? DEFAULT_PAGE,
                size: query.size ?? DEFAULT_SIZE,
                sort: query.sort?.map(({ colId, sort }) => `${colId},${sort}`),
            },
            filters: query.filters?.length ? JSON.stringify(query.filters) : undefined,
        },
        { skip: !enabled }
    );

    const { result, hasResult } = useMemo(() => {
        const parsedResult = parseExecutionResult<Result>(currentData);
        return { result: parsedResult, hasResult: parsedResult !== undefined };
    }, [currentData]);

    return {
        result,
        isError: enabled && !hasResult && (isError || !isFetching),
        isFetching: enabled && isFetching && !hasResult,
    };
}

export function useLoadFlowExecutionResults(
    executionId: string,
    enabled: boolean,
    query: LoadFlowExecutionResultsQuery
) {
    return useParsedExecutionResults<OverloadedEquipment[]>(executionId, enabled, query);
}

export function useSecurityAnalysisExecutionResults(
    executionId: string,
    enabled: boolean,
    query: SecurityAnalysisExecutionResultsQuery
) {
    return useParsedExecutionResults<SecurityAnalysisNmkResult>(executionId, enabled, query);
}

export type AllBusesShortCircuitResult = Page<SCAFaultResult>;

export function useShortCircuitExecutionResults(
    executionId: string,
    enabled: boolean,
    query: ExecutionResultsQuery = {}
) {
    return useParsedExecutionResults<AllBusesShortCircuitResult>(executionId, enabled, {
        ...query,
        resultType: SHORT_CIRCUIT_RESULT_TYPES.AllBuses,
    });
}

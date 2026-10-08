/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useMemo } from 'react';
import { ProcessType, useGetExecutionResultsQuery, type GetExecutionResultsApiResponse } from 'shared/api/monitor-api';
import type { MonitorResultSubtype } from 'shared/api/monitor-api/result-subtypes';

export interface ExecutionResultsQuery {
    resultType?: MonitorResultSubtype;
    page?: number;
    size?: number;
    filters?: unknown[];
    sort?: Array<{ colId: string; sort: string }>;
}

export const DEFAULT_EXECUTION_RESULTS_QUERY: ExecutionResultsQuery = {
    resultType: '',
    page: 0,
    size: 25,
};

export function parseExecutionResult<T>(raw?: string[]): T | null {
    const serializedResult = raw?.[0];
    if (!serializedResult) {
        return null;
    }

    try {
        return JSON.parse(serializedResult) as T;
    } catch {
        return null;
    }
}

export function isValidResultPage(value: unknown): value is { content: unknown[]; totalElements: number } {
    return (
        typeof value === 'object' &&
        value !== null &&
        Array.isArray((value as { content?: unknown }).content) &&
        typeof (value as { totalElements?: unknown }).totalElements === 'number'
    );
}

export function isLoadFlowResult(value: unknown): value is unknown[] {
    return Array.isArray(value);
}

export function useExecutionResults(
    executionId: string,
    processType: string,
    enabled: boolean,
    query: ExecutionResultsQuery = {}
) {
    const effectiveQuery = { ...DEFAULT_EXECUTION_RESULTS_QUERY, ...query };
    const { currentData, isError, isFetching } = useGetExecutionResultsQuery(
        {
            executionId,
            resultType: effectiveQuery.resultType,
            page: effectiveQuery.page,
            size: effectiveQuery.size,
            filters: effectiveQuery.filters?.length ? JSON.stringify(effectiveQuery.filters) : undefined,
            sort: effectiveQuery.sort?.map(({ colId, sort }) => `${colId},${sort}`),
        },
        { skip: !enabled }
    );

    const parsedResult = useMemo(() => {
        const result = parseExecutionResult<string[]>(currentData);
        if (processType === ProcessType.Loadflow) {
            return isLoadFlowResult(result) ? result : null;
        }
        return isValidResultPage(result) ? result : null;
    }, [currentData, processType]);

    const result = parsedResult;

    return {
        result,
        isError: enabled && result === null && (isError || !isFetching),
        isFetching: enabled && isFetching && parsedResult === null,
    };
}

export type ExecutionResultsApiResponse = GetExecutionResultsApiResponse;

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { renderHook } from '@testing-library/react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import type { OverloadedEquipment, Page, SCAFaultResult, SecurityAnalysisNmkResult } from '@gridsuite/commons-ui';
import { SHORT_CIRCUIT_RESULT_TYPES, SECURITY_ANALYSIS_RESULT_TYPES } from 'shared/api/monitor-api/result-subtypes';
import {
    parseExecutionResult,
    useLoadFlowExecutionResults,
    useSecurityAnalysisExecutionResults,
    useShortCircuitExecutionResults,
} from './use-execution-results';

const { getResults } = vi.hoisted(() => ({ getResults: vi.fn() }));

vi.mock('shared/api/monitor-api', () => ({ useGetExecutionResultsQuery: getResults }));

function mockResult(json: string, isFetching = false, isError = false) {
    getResults.mockReturnValue({ currentData: [json], isFetching, isError });
}

describe('parseExecutionResult', () => {
    it('parses the first JSON result and returns undefined for absent or invalid payloads', () => {
        expect(parseExecutionResult<{ content: number[] }>(['{"content":[1,2]}'])).toEqual({ content: [1, 2] });
        expect(parseExecutionResult(['not-json'])).toBeUndefined();
        expect(parseExecutionResult([])).toBeUndefined();
        expect(parseExecutionResult(undefined)).toBeUndefined();
    });
});

describe('calculation-specific execution result hooks', () => {
    it('returns load-flow rows and serializes its request without inspecting the payload shape', () => {
        const rows: OverloadedEquipment[] = [
            {
                subjectId: 'LINE_1',
                limitType: 'CURRENT',
                overload: 1,
                patlOverload: 1,
                locationId: 'BUS_1',
                value: 1,
                actualOverloadDuration: null,
                upComingOverloadDuration: null,
                limit: 1,
                patlLimit: 1,
                limitName: null,
                nextLimitName: null,
                side: undefined,
            },
        ];
        mockResult(JSON.stringify(rows));

        const { result } = renderHook(() =>
            useLoadFlowExecutionResults('execution', true, {
                resultType: 'LIMIT_VIOLATIONS_CURRENT',
                page: 2,
                size: 50,
                filters: [{ column: 'subjectId', value: 'LINE_1' }],
                sort: [{ colId: 'subjectId', sort: 'asc' }],
            })
        );

        expectTypeOf(result.current.result).toEqualTypeOf<OverloadedEquipment[] | undefined>();
        expect(result.current.result).toEqual(rows);
        expect(getResults).toHaveBeenCalledWith(
            {
                executionId: 'execution',
                resultType: 'LIMIT_VIOLATIONS_CURRENT',
                page: 2,
                size: 50,
                filters: '[{"column":"subjectId","value":"LINE_1"}]',
                sort: ['subjectId,asc'],
            },
            { skip: false }
        );
    });

    it('returns the security-analysis NMK page type for any supported NMK subtype', () => {
        const page: SecurityAnalysisNmkResult = {
            content: [[{ contingency: { contingencyId: 'CONTINGENCY_1' } }]],
            totalElements: 1,
        };
        mockResult(JSON.stringify(page));

        const { result } = renderHook(() =>
            useSecurityAnalysisExecutionResults('execution', true, {
                resultType: SECURITY_ANALYSIS_RESULT_TYPES.NmkContingencies,
            })
        );

        expectTypeOf(result.current.result).toEqualTypeOf<SecurityAnalysisNmkResult | undefined>();
        expect(result.current.result).toEqual(page);
        expect(getResults).toHaveBeenCalledWith(
            {
                executionId: 'execution',
                resultType: SECURITY_ANALYSIS_RESULT_TYPES.NmkContingencies,
                page: 0,
                size: 25,
                filters: undefined,
                sort: undefined,
            },
            { skip: false }
        );
    });

    it('fixes short-circuit results to the ALL_BUSES fault-result page', () => {
        const page: Page<SCAFaultResult> = { content: [], totalElements: 0 };
        mockResult(JSON.stringify(page));

        const { result } = renderHook(() => useShortCircuitExecutionResults('execution', true));

        expectTypeOf(result.current.result).toEqualTypeOf<Page<SCAFaultResult> | undefined>();
        expect(result.current.result).toEqual(page);
        expect(getResults).toHaveBeenCalledWith(
            {
                executionId: 'execution',
                resultType: SHORT_CIRCUIT_RESULT_TYPES.AllBuses,
                page: 0,
                size: 25,
                filters: undefined,
                sort: undefined,
            },
            { skip: false }
        );
    });

    it('reports malformed JSON as an error and keeps disabled queries skipped', () => {
        mockResult('not-json');
        const enabled = renderHook(() =>
            useLoadFlowExecutionResults('execution', true, {
                resultType: 'LIMIT_VIOLATIONS_CURRENT',
            })
        );
        expect(enabled.result.current).toMatchObject({ result: undefined, isError: true, isFetching: false });

        getResults.mockReturnValue({ currentData: undefined, isFetching: false, isError: false });
        const disabled = renderHook(() =>
            useSecurityAnalysisExecutionResults('execution', false, {
                resultType: SECURITY_ANALYSIS_RESULT_TYPES.NmkLimitViolations,
            })
        );
        expect(disabled.result.current).toMatchObject({ result: undefined, isError: false, isFetching: false });
        expect(getResults).toHaveBeenLastCalledWith(expect.any(Object), { skip: true });
    });
});

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { renderHook } from '@testing-library/react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import {
    SortWay,
    type OverloadedEquipment,
    type Page,
    type SCAFaultResult,
    type SecurityAnalysisNmkResult,
} from '@gridsuite/commons-ui';
import { SHORT_CIRCUIT_RESULT_TYPES, SECURITY_ANALYSIS_RESULT_TYPES } from 'shared/api/monitor-api/result-subtypes';
import {
    useLoadFlowExecutionResults,
    useSecurityAnalysisExecutionResults,
    useShortCircuitExecutionResults,
} from './use-execution-results';

const { getResults } = vi.hoisted(() => ({ getResults: vi.fn() }));

vi.mock('shared/api/monitor-api', () => ({ useGetExecutionResultsQuery: getResults }));

function mockResult(result: unknown, isFetching = false, isError = false) {
    getResults.mockReturnValue({ currentData: result, isFetching, isError });
}

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
        mockResult(rows);

        const { result } = renderHook(() =>
            useLoadFlowExecutionResults('execution', true, {
                resultType: 'LIMIT_VIOLATIONS_CURRENT',
                page: 2,
                size: 50,
                filters: [{ column: 'subjectId', value: 'LINE_1' }],
                sort: [{ colId: 'subjectId', sort: SortWay.ASC }],
            })
        );

        expectTypeOf(result.current.result).toEqualTypeOf<OverloadedEquipment[] | undefined>();
        expect(result.current.result).toEqual(rows);
        expect(getResults).toHaveBeenCalledWith(
            {
                executionId: 'execution',
                resultType: 'LIMIT_VIOLATIONS_CURRENT',
                pageable: {
                    page: 2,
                    size: 50,
                    sort: ['subjectId,asc'],
                },
                filters: '[{"column":"subjectId","value":"LINE_1"}]',
            },
            { skip: false }
        );
    });

    it('returns the security-analysis NMK page type for any supported NMK subtype', () => {
        const page: SecurityAnalysisNmkResult = {
            content: [[{ contingency: { contingencyId: 'CONTINGENCY_1' } }]],
            totalElements: 1,
        };
        mockResult(page);

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
                pageable: {
                    page: 0,
                    size: 25,
                    sort: undefined,
                },
                filters: undefined,
            },
            { skip: false }
        );
    });

    it('fixes short-circuit results to the ALL_BUSES fault-result page', () => {
        const page: Page<SCAFaultResult> = { content: [], totalElements: 0 };
        mockResult(page);

        const { result } = renderHook(() => useShortCircuitExecutionResults('execution', true));

        expectTypeOf(result.current.result).toEqualTypeOf<Page<SCAFaultResult> | undefined>();
        expect(result.current.result).toEqual(page);
        expect(getResults).toHaveBeenCalledWith(
            {
                executionId: 'execution',
                resultType: SHORT_CIRCUIT_RESULT_TYPES.AllBuses,
                pageable: {
                    page: 0,
                    size: 25,
                    sort: undefined,
                },
                filters: undefined,
            },
            { skip: false }
        );
    });

    it('reports request errors and keeps disabled queries skipped', () => {
        getResults.mockReturnValue({ currentData: undefined, isFetching: false, isError: true });
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

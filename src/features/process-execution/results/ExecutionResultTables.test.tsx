/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
    NmkType,
    RunningStatus,
    ShortCircuitAnalysisType,
    SHORTCIRCUIT_ANALYSIS_RESULT_SORT_STORE,
    SortWay,
    TableType,
    mappingTabs,
} from '@gridsuite/commons-ui';
import { ProcessStatus } from 'shared/api/monitor-api';
import { renderWithProviders } from 'test-utils/render-with-providers';
import { LoadFlowExecutionResultTable } from './LoadFlowExecutionResult';
import { SecurityAnalysisExecutionResultTable } from './SecurityAnalysisExecutionResult';
import { ShortCircuitExecutionResultTable } from './ShortCircuitExecutionResult';

const { loadFlowResults, securityAnalysisResults, shortCircuitResults } = vi.hoisted(() => ({
    loadFlowResults: vi.fn(),
    securityAnalysisResults: vi.fn(),
    shortCircuitResults: vi.fn(),
}));

vi.mock('./hooks/use-execution-results', () => ({
    useLoadFlowExecutionResults: loadFlowResults,
    useSecurityAnalysisExecutionResults: securityAnalysisResults,
    useShortCircuitExecutionResults: shortCircuitResults,
}));

vi.mock('@gridsuite/commons-ui', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@gridsuite/commons-ui')>();
    return {
        ...actual,
        LimitViolationResult: ({ result, computationStatus }: any) => (
            <div data-testid="load-flow-view">
                {result?.[0]?.subjectId}:{computationStatus}
            </div>
        ),
        SecurityAnalysisResultNmk: ({ result, securityAnalysisStatus }: any) => (
            <div data-testid="security-analysis-view">
                {result?.content?.length}:{securityAnalysisStatus}
            </div>
        ),
        ShortCircuitAnalysisResultView: ({ result, analysisStatus }: any) => (
            <div data-testid="short-circuit-view">
                {result?.[0]?.id}:{analysisStatus}
            </div>
        ),
        useSnackMessage: () => ({ snackError: vi.fn() }),
        useIntlResultStatusMessages: () => ({}),
    };
});

describe('execution result tables', () => {
    it.each([
        {
            Component: LoadFlowExecutionResultTable,
            results: loadFlowResults,
            table: TableType.Loadflow,
            tab: 'LIMIT_VIOLATIONS_CURRENT',
            column: 'subjectId',
            backendColumn: 'subjectId',
        },
        {
            Component: SecurityAnalysisExecutionResultTable,
            results: securityAnalysisResults,
            table: TableType.SecurityAnalysis,
            tab: NmkType.CONSTRAINTS_FROM_CONTINGENCIES,
            column: 'contingencyId',
            backendColumn: 'contingencyId',
        },
        {
            Component: ShortCircuitExecutionResultTable,
            results: shortCircuitResults,
            table: SHORTCIRCUIT_ANALYSIS_RESULT_SORT_STORE,
            tab: mappingTabs(ShortCircuitAnalysisType.ALL_BUSES),
            column: 'elementId',
            backendColumn: 'fault.id',
        },
    ])('reads $table sorting from the results slice', ({ Component, results, table, tab, column, backendColumn }) => {
        results.mockReturnValue({ result: undefined, isError: false, isFetching: false });

        renderWithProviders(<Component executionId="execution-1" />, {
            state: {
                processExecutionResults: {
                    tableSort: { [table]: { [tab]: [{ colId: column, sort: SortWay.DESC }] } },
                    tableFilters: { columnsFilters: {} },
                },
            },
        });

        expect(results).toHaveBeenLastCalledWith(
            'execution-1',
            true,
            expect.objectContaining({ sort: [{ colId: backendColumn, sort: SortWay.DESC }] })
        );
    });

    it('shows load-flow violations and marks a failed execution as failed', () => {
        loadFlowResults.mockReturnValue({
            result: [{ subjectId: 'LINE_1' }],
            isError: false,
            isFetching: false,
        });

        renderWithProviders(
            <LoadFlowExecutionResultTable executionId="execution-1" executionStatus={ProcessStatus.Failed} />
        );

        expect(screen.getByTestId('load-flow-view')).toHaveTextContent(`LINE_1:${RunningStatus.FAILED}`);
    });

    it('shows security-analysis results and marks a result request error as failed', () => {
        securityAnalysisResults.mockReturnValue({
            result: { content: [[{ contingency: { contingencyId: 'CONTINGENCY_1' } }]], totalElements: 1 },
            isError: true,
            isFetching: false,
        });

        renderWithProviders(<SecurityAnalysisExecutionResultTable executionId="execution-1" />);

        expect(screen.getByTestId('security-analysis-view')).toHaveTextContent(`1:${RunningStatus.FAILED}`);
    });

    it('shows short-circuit results and marks a completed execution as successful', () => {
        shortCircuitResults.mockReturnValue({
            result: { content: [{ id: 'BUS_1' }], totalElements: 1 },
            isError: false,
            isFetching: false,
        });

        renderWithProviders(
            <ShortCircuitExecutionResultTable executionId="execution-1" executionStatus={ProcessStatus.Completed} />
        );

        expect(screen.getByTestId('short-circuit-view')).toHaveTextContent(`BUS_1:${RunningStatus.SUCCEED}`);
    });
});

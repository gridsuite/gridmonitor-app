/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useContext, type ReactElement } from 'react';
import { IntlProvider } from 'react-intl';
import { CustomAggridFilterContext, TableType } from '@gridsuite/commons-ui';
import { renderWithProviders } from 'test-utils/render-with-providers';
import { LoadFlowExecutionResultTable } from '../LoadFlowExecutionResult';
import { ShortCircuitExecutionResultTable } from '../ShortCircuitExecutionResult';
import { SecurityAnalysisExecutionResultTable } from '../SecurityAnalysisExecutionResult';

const { getResults } = vi.hoisted(() => ({
    getResults: vi.fn(),
}));

vi.mock('shared/api/monitor-api', async (importOriginal) => ({
    ...(await importOriginal<typeof import('shared/api/monitor-api')>()),
    useGetExecutionResultsQuery: getResults,
}));

function FilterControls({ type, tab, column }: { type: TableType; tab: string; column: string }) {
    const context = useContext(CustomAggridFilterContext);
    const filter = { column, value: 'LINE', type: 'contains', dataType: 'text' };
    return (
        <>
            <button type="button" onClick={() => context!.updateFilter(column, { type, tab }, [filter], filter)}>
                Filter
            </button>
            <button type="button" onClick={() => context!.updateFilter(column, { type, tab }, [], undefined)}>
                Clear
            </button>
        </>
    );
}

vi.mock('@gridsuite/commons-ui', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@gridsuite/commons-ui')>();
    return {
        ...actual,
        LimitViolationResult: ({ columnDefs }: { columnDefs: any[] }) => (
            <FilterControls
                type={actual.TableType.Loadflow}
                tab={columnDefs[0].headerComponentParams.filterComponentParams.filterParams.tab}
                column="subjectId"
            />
        ),
        ShortCircuitAnalysisResultView: ({ pagination }: { pagination: any }) => (
            <>
                <FilterControls type={actual.TableType.ShortcircuitAnalysis} tab="allBuses" column="voltageLevel" />
                <button type="button" onClick={() => pagination.onPageChange(null, 3)}>
                    Next page
                </button>
            </>
        ),
        SecurityAnalysisResultNmk: ({ columnDefs, paginationProps }: { columnDefs: any[]; paginationProps: any }) => (
            <>
                <FilterControls
                    type={actual.TableType.SecurityAnalysis}
                    tab={columnDefs[0].headerComponentParams.filterComponentParams.filterParams.tab}
                    column="contingencyId"
                />
                <button type="button" onClick={() => paginationProps.onPageChange(null, 3)}>
                    Next page
                </button>
            </>
        ),
    };
});

function renderResults(ui: ReactElement) {
    const ids = [
        'LoadFlowResultsCurrentViolations',
        'grid.noCalculation',
        'grid.noRowsToShow',
        'grid.noMatchedFilters',
        'grid.running',
        'grid.failed',
        'LoadingRemoteData',
        'ConstraintsFromContingencies',
        'ContingenciesFromConstraints',
        'CutOffPowerFromConstraints',
        'MuiVirtualizedTable/exportCSV',
    ];
    return renderWithProviders(
        <IntlProvider locale="en" messages={Object.fromEntries(ids.map((id) => [id, id]))}>
            {ui}
        </IntlProvider>
    );
}

function lastQuery() {
    return getResults.mock.calls.at(-1)![0];
}

beforeEach(() => {
    getResults.mockReset();
    getResults.mockReturnValue({
        currentData: { content: [], totalElements: 0 },
        isError: false,
        isFetching: false,
    });
});

describe('execution result column-filter request wiring', () => {
    it('sends load-flow user filters alongside CURRENT and retains only CURRENT after clearing', async () => {
        getResults.mockReturnValue({ currentData: [], isError: false, isFetching: false });
        renderResults(<LoadFlowExecutionResultTable executionId="execution" />);
        fireEvent.click(screen.getByText('Filter'));
        await waitFor(() =>
            expect(JSON.parse(lastQuery().filters)).toEqual([
                { column: 'subjectId', value: 'LINE', type: 'contains', dataType: 'text' },
                { column: 'limitType', value: ['CURRENT'], type: 'equals', dataType: 'text' },
            ])
        );
        fireEvent.click(screen.getByText('Clear'));
        expect(JSON.parse(lastQuery().filters)).toHaveLength(1);
    });

    it('reads short-circuit allBuses filters, maps fields, resets pagination, and clears request filters', async () => {
        renderResults(<ShortCircuitExecutionResultTable executionId="execution" />);
        fireEvent.click(screen.getByText('Next page'));
        expect(lastQuery().pageable.page).toBe(3);
        fireEvent.click(screen.getByText('Filter'));
        await waitFor(() => expect(JSON.parse(lastQuery().filters)[0].column).toBe('fault.voltageLevelId'));
        expect(lastQuery()).toMatchObject({ resultType: 'ALL_BUSES', pageable: { page: 0 } });
        fireEvent.click(screen.getByText('Clear'));
        expect(lastQuery().filters).toBeUndefined();
    });

    it('wires all security-analysis subtypes to their backend mappings', async () => {
        renderResults(<SecurityAnalysisExecutionResultTable executionId="execution" />);
        fireEvent.click(screen.getByText('Next page'));
        fireEvent.click(screen.getByText('Filter'));
        await waitFor(() =>
            expect(lastQuery()).toMatchObject({ resultType: 'NMK_CONTINGENCIES', pageable: { page: 0 } })
        );
        expect(JSON.parse(lastQuery().filters)[0].column).toBe('contingencyId');
        fireEvent.click(screen.getAllByRole('tab')[1]);
        fireEvent.click(screen.getByText('Filter'));
        expect(lastQuery().resultType).toBe('NMK_LIMIT_VIOLATIONS');
        expect(JSON.parse(lastQuery().filters)[0].column).toBe('contingencyLimitViolations.contingency.contingencyId');
        fireEvent.click(screen.getAllByRole('tab')[2]);
        fireEvent.click(screen.getByText('Filter'));
        expect(lastQuery().resultType).toBe('NMK_CUT_OFF_POWER');
        expect(JSON.parse(lastQuery().filters)[0].column).toBe('contingencyId');
        fireEvent.click(screen.getByText('Clear'));
        expect(lastQuery().filters).toBeUndefined();
    });
});

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SortWay, TableType, useCustomAggridFilterContext, useCustomAggridSortContext } from '@gridsuite/commons-ui';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ExecutionListTableProvider } from 'features/process-execution/list/providers/ExecutionListTableProvider';
import { ExecutionResultsTableProvider } from 'features/process-execution/results/providers/ExecutionResultsTableProvider';
import { ExecutionLogsTableProvider } from 'features/process-execution/logs/providers/ExecutionLogsTableProvider';
import { renderWithProviders } from 'test-utils/render-with-providers';

const sortParams = { table: TableType.Loadflow, tab: 'LIMIT_VIOLATIONS_CURRENT' };
const filterParams = { type: TableType.Loadflow, tab: sortParams.tab };
const sort = [{ colId: 'subjectId', sort: SortWay.DESC }];
const filter = { column: 'subjectId', type: 'contains', dataType: 'text', value: 'LINE' };

function TableControls() {
    const { getSortConfig, setSortConfig } = useCustomAggridSortContext();
    const { getFilters, updateFilter } = useCustomAggridFilterContext();

    return (
        <>
            <span data-testid="sort">{JSON.stringify(getSortConfig(sortParams))}</span>
            <span data-testid="filters">{JSON.stringify(getFilters(filterParams))}</span>
            <button type="button" onClick={() => setSortConfig(sortParams, sort)}>
                Sort
            </button>
            <button type="button" onClick={() => updateFilter(filter.column, filterParams, [filter], filter)}>
                Filter
            </button>
            <button
                type="button"
                onClick={() => {
                    setSortConfig(sortParams, []);
                    updateFilter(filter.column, filterParams, [], undefined);
                }}
            >
                Clear
            </button>
        </>
    );
}

const features = [
    { key: 'processExecutionList', Provider: ExecutionListTableProvider },
    { key: 'executionResults', Provider: ExecutionResultsTableProvider },
    { key: 'executionLogs', Provider: ExecutionLogsTableProvider },
] as const;

describe('feature-owned table state', () => {
    it.each(features)('isolates and retains $key state across provider remounts', async ({ key, Provider }) => {
        const table = (
            <Provider>
                <TableControls />
            </Provider>
        );
        const { store, user, rerender } = renderWithProviders(table);
        const initialState = store.getState();

        await user.click(screen.getByRole('button', { name: 'Sort' }));
        await user.click(screen.getByRole('button', { name: 'Filter' }));

        expect(store.getState()[key].tableSort[sortParams.table]?.[sortParams.tab]).toEqual(sort);
        expect(store.getState()[key].tableFilters.columnsFilters[filterParams.type]?.[filterParams.tab]).toEqual([
            filter,
        ]);
        features
            .filter((feature) => feature.key !== key)
            .forEach((other) => {
                expect(store.getState()[other.key]).toEqual(initialState[other.key]);
            });

        rerender(<div />);
        rerender(table);

        expect(screen.getByTestId('sort')).toHaveTextContent(JSON.stringify(sort));
        expect(screen.getByTestId('filters')).toHaveTextContent(JSON.stringify([filter]));

        await user.click(screen.getByRole('button', { name: 'Clear' }));

        expect(screen.getByTestId('sort')).toHaveTextContent('[]');
        expect(screen.getByTestId('filters')).toHaveTextContent('[]');
        features
            .filter((feature) => feature.key !== key)
            .forEach((other) => {
                expect(store.getState()[other.key]).toEqual(initialState[other.key]);
            });
    });
});

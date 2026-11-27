/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useContext } from 'react';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { act, render } from '@testing-library/react';
import {
    CustomAggridFilterContext,
    CustomAggridSortContext,
    SortWay,
    TableType,
    type CustomAggridFilterContextValue,
    type CustomAggridSortContextValue,
} from '@gridsuite/commons-ui';
import { describe, expect, it } from 'vitest';
import { createCustomAggridReduxProvider } from './create-custom-aggrid-redux-provider';
import { tableStateReducers, type TableStateSlice } from './table-state.reducers';

const initialState: TableStateSlice = { tableSort: {}, tableFilters: {} };
const slice = createSlice({ name: 'testTable', initialState, reducers: { ...tableStateReducers } });
const { setTableSort, setTableFilters } = slice.actions;

const TestProvider = createCustomAggridReduxProvider({
    selectState: (state) => (state as unknown as { testTable: TableStateSlice }).testTable,
    setTableSort,
    setTableFilters,
});

describe('createCustomAggridReduxProvider', () => {
    it('reads and dispatches sort and filters through the store', () => {
        const store = configureStore({ reducer: { testTable: slice.reducer } });
        let sortCtx!: CustomAggridSortContextValue;
        let filterCtx!: CustomAggridFilterContextValue;

        function Consumer() {
            sortCtx = useContext(CustomAggridSortContext)!;
            filterCtx = useContext(CustomAggridFilterContext)!;
            return null;
        }

        render(
            <Provider store={store}>
                <TestProvider>
                    <Consumer />
                </TestProvider>
            </Provider>
        );

        expect(sortCtx.getSortConfig({ table: 't', tab: 'a' })).toEqual([]);
        expect(sortCtx.getSortConfig(undefined)).toBeUndefined();
        expect(filterCtx.getFilters({ type: TableType.Logs, tab: 'a' })).toEqual([]);

        const sorts = [{ colId: 'c', sort: SortWay.ASC }];
        act(() => sortCtx.setSortConfig({ table: 't', tab: 'a' }, sorts));
        expect(store.getState().testTable.tableSort.t.a).toEqual(sorts);
        expect(sortCtx.getSortConfig({ table: 't', tab: 'a' })).toEqual(sorts);

        const filters = [{ column: 'c', type: 'contains', value: 'x', dataType: 'text' }];
        act(() =>
            filterCtx.updateFilter('c', { type: TableType.Logs, tab: 'a' } as never, filters as never, undefined)
        );
        expect(store.getState().testTable.tableFilters[TableType.Logs].a).toEqual(filters);
        expect(filterCtx.getFilters({ type: TableType.Logs, tab: 'a' })).toEqual(filters);
    });
});

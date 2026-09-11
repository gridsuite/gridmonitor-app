/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice } from '@reduxjs/toolkit';
import { FilterConfig, SortConfig, SortWay, TableType } from '@gridsuite/commons-ui';
import { AppState } from './app-state.type';
import { TABLE_SORT, TableSortAction, UPDATE_COLUMN_FILTERS, UpdateColumnFiltersAction } from './actions';
import { PROCESS_EXECUTION_HISTORY_SORT_STORE, TABLE_SORT_STORE } from './store-sort-filter-fields';

const initialSortState: Record<string, SortConfig[]> = {
    [PROCESS_EXECUTION_HISTORY_SORT_STORE]: [{ colId: 'processScheduledAt', sort: SortWay.DESC }],
};

const initialFilterState: Record<string, FilterConfig[]> = {
    [PROCESS_EXECUTION_HISTORY_SORT_STORE]: [],
};

const initialState: AppState = {
    // @ts-ignore
    [TABLE_SORT_STORE]: {
        [PROCESS_EXECUTION_HISTORY_SORT_STORE]: initialSortState,
    },
    tableFilters: {
        columnsFilters: {
            [TableType.ProcessExecutionHistory]: { ...initialFilterState },
        },
    },
    tables: { uuid: null },
};

const appStateSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(TABLE_SORT, (state, action: TableSortAction) => {
            state.tableSort[action.table][action.tab] = action.sort;
        });

        builder.addCase(UPDATE_COLUMN_FILTERS, (state, action: UpdateColumnFiltersAction) => {
            const { filterType, filterSubType, filters } = action;
            state.tableFilters.columnsFilters[filterType] ??= {};
            state.tableFilters.columnsFilters[filterType][filterSubType] = filters;
        });
    },
});

export const appStateReducer = appStateSlice.reducer;

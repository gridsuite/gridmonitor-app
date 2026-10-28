/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice } from '@reduxjs/toolkit';
import { SortWay, TableSortConfig, TableType } from '@gridsuite/commons-ui';
import type { TableState } from 'shared/types/table-state';

const initialSortState: TableSortConfig = {
    [PROCESS_EXECUTION_LIST_SORT_STORE]: [{ colId: 'processScheduledAt', sort: SortWay.DESC }],
};

const initialProcessExecutionListFilterState = {
    [PROCESS_EXECUTION_LIST_SORT_STORE]: [],
};

const initialState: TableState = {
    tableSort: {
        [PROCESS_EXECUTION_LIST_SORT_STORE]: {
            ...initialSortState,
        },
    },
    tableFilters: {
        columnsFilters: {
            [TableType.ProcessExecutionList]: {
                ...initialProcessExecutionListFilterState,
            },
        },
    },
};

const processExecutionListSlice = createSlice({
    name: 'processExecutionList',
    initialState,
    reducers: {
        setTableSort: (state, action: PayloadAction<TableSortUpdate>) => {
            const { table, tab, sorts } = action.payload;
            state.tableSort[table] ??= {};
            state.tableSort[table][tab] = sorts;
        },
        setTableFilters: (state, action: PayloadAction<TableFiltersUpdate>) => {
            const { filterType, filterSubType, filters } = action.payload;
            state.tableFilters.columnsFilters[filterType] ??= {};
            state.tableFilters.columnsFilters[filterType][filterSubType] = filters;
        },
    },
});

export const { setTableSort, setTableFilters } = processExecutionListSlice.actions;

export const processExecutionListReducer = processExecutionListSlice.reducer;

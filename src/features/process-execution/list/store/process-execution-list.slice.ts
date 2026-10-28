/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SortWay, TableSortConfig, TableType } from '@gridsuite/commons-ui';
import type { TableFiltersUpdate, TableSortUpdate, TableState } from 'shared/types/table-state';
import { PROCESS_EXECUTION_HISTORY_SORT_STORE } from './process-execution-list.constants';

const initialSortState: TableSortConfig = {
    [PROCESS_EXECUTION_HISTORY_SORT_STORE]: [{ colId: 'processScheduledAt', sort: SortWay.DESC }],
};

const initialProcessExecutionHistoryFilterState = {
    [PROCESS_EXECUTION_HISTORY_SORT_STORE]: [],
};

const initialState: TableState = {
    tableSort: {
        [PROCESS_EXECUTION_HISTORY_SORT_STORE]: {
            ...initialSortState,
        },
    },
    tableFilters: {
        columnsFilters: {
            [TableType.ProcessExecutionHistory]: {
                ...initialProcessExecutionHistoryFilterState,
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

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    FilterConfig,
    PROCESS_EXECUTION,
    PROCESS_EXECUTION_LIST_SORT_STORE,
    SortConfig,
    SortWay,
    TableSortConfig,
    TableType,
} from '@gridsuite/commons-ui';
import { ProcessTablesState } from './process-execution-list.type';

type SetTableSortPayload = {
    table: string;
    tab: string;
    sorts: SortConfig[];
};

type SetTableFiltersPayload = {
    filterType: TableType;
    filterSubType: string;
    filters: FilterConfig[];
};

const initialSortState: TableSortConfig = {
    [PROCESS_EXECUTION_LIST_SORT_STORE]: [{ colId: 'processScheduledAt', sort: SortWay.DESC }],
};

const initialProcessExecutionListFilterState = {
    [PROCESS_EXECUTION_LIST_SORT_STORE]: [],
};

const initialLogsFilterState = {
    [PROCESS_EXECUTION]: [],
};

const initialState: ProcessTablesState = {
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
            [TableType.Logs]: {
                ...initialLogsFilterState,
            },
            [TableType.SecurityAnalysis]: {},
            [TableType.ShortcircuitAnalysis]: {},
        },
    },
    tables: { uuid: null },
};

const processExecutionListSlice = createSlice({
    name: 'processExecutionList',
    initialState,
    reducers: {
        setTableSort: (state, action: PayloadAction<SetTableSortPayload>) => {
            const { table, tab, sorts } = action.payload;
            state.tableSort[table] ??= {};
            state.tableSort[table][tab] = sorts;
        },
        setTableFilters: (state, action: PayloadAction<SetTableFiltersPayload>) => {
            const { filterType, filterSubType, filters } = action.payload;
            state.tableFilters.columnsFilters[filterType] ??= {};
            state.tableFilters.columnsFilters[filterType][filterSubType] = filters;
        },
    },
});

export const { setTableSort, setTableFilters } = processExecutionListSlice.actions;

export const processExecutionListReducer = processExecutionListSlice.reducer;

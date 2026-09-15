/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterConfig, SortConfig, SortWay, TableSortKeysType, TableType } from '@gridsuite/commons-ui';
import { PROCESS_EXECUTION_HISTORY_SORT_STORE } from './process-results.constants';
import { ProcessResultsState } from './process-results.type';

type SetProcessExecutionHistoryTableSortPayload = {
    table: TableSortKeysType;
    tab: string;
    sort: SortConfig[];
};

type SetProcessExecutionHistoryTableFiltersPayload = {
    filterType: TableType;
    filterSubType: string;
    filters: FilterConfig[];
};

const initialSortState: Record<string, SortConfig[]> = {
    [PROCESS_EXECUTION_HISTORY_SORT_STORE]: [{ colId: 'processScheduledAt', sort: SortWay.DESC }],
};

const initialFilterState = {
    [PROCESS_EXECUTION_HISTORY_SORT_STORE]: [],
};

const initialState: ProcessResultsState = {
    tableSort: {
        [PROCESS_EXECUTION_HISTORY_SORT_STORE]: {
            ...initialSortState,
        },
    },
    tableFilters: {
        columnsFilters: {
            [TableType.ProcessExecutionHistory]: {
                ...initialFilterState,
            },
        },
    },
    tables: { uuid: null },
};

const processResultsSlice = createSlice({
    name: 'processResults',
    initialState,
    reducers: {
        setProcessExecutionHistoryTableSort: (
            state,
            action: PayloadAction<SetProcessExecutionHistoryTableSortPayload>
        ) => {
            const { table, tab, sort } = action.payload;
            state.tableSort[table][tab] = sort;
        },
        setProcessExecutionHistoryTableFilters: (
            state,
            action: PayloadAction<SetProcessExecutionHistoryTableFiltersPayload>
        ) => {
            const { filterType, filterSubType, filters } = action.payload;
            state.tableFilters.columnsFilters[filterType] ??= {};
            state.tableFilters.columnsFilters[filterType][filterSubType] = filters;
        },
    },
});

export const { setProcessExecutionHistoryTableSort, setProcessExecutionHistoryTableFilters } =
    processResultsSlice.actions;
export const processResultsReducer = processResultsSlice.reducer;

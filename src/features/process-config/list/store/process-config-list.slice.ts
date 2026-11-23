/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterConfig, SortConfig, TableColumnFilter, TableSort, TableType } from '@gridsuite/commons-ui';
import {
    PROCESS_CONFIG_ACTIVE_TAB,
    PROCESS_CONFIG_HISTORY_TAB,
    PROCESS_CONFIG_LIST_SORT_STORE,
} from './process-config-list.constants';

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

export interface ProcessConfigListState {
    tableSort: TableSort;
    tableFilters: { columnsFilters: TableColumnFilter };
}

const initialState: ProcessConfigListState = {
    tableSort: {
        [PROCESS_CONFIG_LIST_SORT_STORE]: {
            [PROCESS_CONFIG_ACTIVE_TAB]: [],
            [PROCESS_CONFIG_HISTORY_TAB]: [],
        },
    },
    tableFilters: {
        columnsFilters: {
            [TableType.ProcessExecutionList]: {
                [PROCESS_CONFIG_ACTIVE_TAB]: [],
                [PROCESS_CONFIG_HISTORY_TAB]: [],
            },
        },
    },
};

const processConfigListSlice = createSlice({
    name: 'processConfigList',
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

export const { setTableSort, setTableFilters } = processConfigListSlice.actions;

export const processConfigListReducer = processConfigListSlice.reducer;

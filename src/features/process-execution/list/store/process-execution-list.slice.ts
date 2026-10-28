/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice } from '@reduxjs/toolkit';
import { PROCESS_EXECUTION_LIST_SORT_STORE, SortWay, TableSortConfig, TableType } from '@gridsuite/commons-ui';
import type { TableState } from 'shared/types/table-state';
import { tableStateReducers } from 'shared/store/table-state-reducers';

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
    reducers: tableStateReducers,
});

export const executionListTableActions = processExecutionListSlice.actions;

export const { setTableSort, setTableFilters } = executionListTableActions;

export const processExecutionListReducer = processExecutionListSlice.reducer;

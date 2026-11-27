/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice } from '@reduxjs/toolkit';
import { PROCESS_EXECUTION, SortWay, TableSortConfig, TableType } from '@gridsuite/commons-ui';
import { tableStateReducers } from '../../../../shared/lib/aggrid-table-state/table-state.reducers';
import { ProcessTablesState } from './process-execution-list.type';
import { PROCESS_EXECUTION_LIST, PROCESS_EXECUTION_LIST_STORE } from './process-execution-list.constants';

const initialSortState: TableSortConfig = {
    [PROCESS_EXECUTION_LIST]: [{ colId: 'processScheduledAt', sort: SortWay.DESC }],
};

const initialProcessExecutionListFilterState = {
    [PROCESS_EXECUTION_LIST]: [],
};

const initialLogsFilterState = {
    [PROCESS_EXECUTION]: [],
};

const initialState: ProcessTablesState = {
    tableSort: {
        [PROCESS_EXECUTION_LIST_STORE]: {
            ...initialSortState,
        },
    },
    tableFilters: {
        [PROCESS_EXECUTION_LIST_STORE]: {
            ...initialProcessExecutionListFilterState,
        },
        [TableType.Logs]: {
            ...initialLogsFilterState,
        },
        [TableType.SecurityAnalysis]: {},
        [TableType.ShortcircuitAnalysis]: {},
    },
    tables: { uuid: null },
};

const processExecutionListSlice = createSlice({
    name: 'processExecutionList',
    initialState,
    reducers: { ...tableStateReducers },
});

export const { setTableSort, setTableFilters } = processExecutionListSlice.actions;

export const processExecutionListReducer = processExecutionListSlice.reducer;

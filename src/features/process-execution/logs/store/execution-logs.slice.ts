/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice } from '@reduxjs/toolkit';
import { PROCESS_EXECUTION, TableType } from '@gridsuite/commons-ui';
import type { TableState } from 'shared/types/table-state';
import { tableStateReducers } from 'shared/store/table-state-reducers';

const initialState: TableState = {
    tableSort: {},
    tableFilters: {
        columnsFilters: {
            [TableType.Logs]: {
                [PROCESS_EXECUTION]: [],
            },
        },
    },
};

const executionLogsSlice = createSlice({
    name: 'executionLogs',
    initialState,
    reducers: tableStateReducers,
});

export const executionLogsTableActions = executionLogsSlice.actions;

export const { setTableSort, setTableFilters } = executionLogsTableActions;

export const executionLogsReducer = executionLogsSlice.reducer;

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice } from '@reduxjs/toolkit';
import { TableType } from '@gridsuite/commons-ui';
import type { TableState } from 'shared/types/table-state';
import { tableStateReducers } from 'shared/store/table-state-reducers';

const initialState: TableState = {
    tableSort: {},
    tableFilters: {
        columnsFilters: {
            [TableType.Loadflow]: {},
            [TableType.SecurityAnalysis]: {},
            [TableType.ShortcircuitAnalysis]: {},
        },
    },
};

const executionResultsSlice = createSlice({
    name: 'executionResults',
    initialState,
    reducers: tableStateReducers,
});

export const executionResultsTableActions = executionResultsSlice.actions;

export const { setTableSort, setTableFilters } = executionResultsTableActions;

export const executionResultsReducer = executionResultsSlice.reducer;

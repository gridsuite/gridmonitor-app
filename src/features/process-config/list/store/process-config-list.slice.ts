/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice } from '@reduxjs/toolkit';
import { SortWay, TableColumnFilter, TableSort } from '@gridsuite/commons-ui';
import { tableStateReducers } from '../../../../shared/lib/aggrid-table-state/table-state.reducers';
import { PROCESS_CONFIG_ACTIVE, PROCESS_CONFIG_HISTORY, PROCESS_CONFIG_LIST } from './process-config-list.constants';

export interface ProcessConfigListState {
    tableSort: TableSort;
    tableFilters: TableColumnFilter;
}

const initialState: ProcessConfigListState = {
    tableSort: {
        [PROCESS_CONFIG_LIST]: {
            [PROCESS_CONFIG_ACTIVE]: [{ colId: 'processType', sort: SortWay.ASC }],
            [PROCESS_CONFIG_HISTORY]: [],
        },
    },
    tableFilters: {
        [PROCESS_CONFIG_LIST]: {
            [PROCESS_CONFIG_HISTORY]: [],
        },
    },
};

const processConfigListSlice = createSlice({
    name: 'processConfigList',
    initialState,
    reducers: { ...tableStateReducers },
});

export const { setTableSort, setTableFilters } = processConfigListSlice.actions;

export const processConfigListReducer = processConfigListSlice.reducer;

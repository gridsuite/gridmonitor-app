/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { Draft, PayloadAction } from '@reduxjs/toolkit';
import type { TableFiltersUpdate, TableSortUpdate, TableState } from '../types/table-state';

export const tableStateReducers = {
    setTableSort: (state: Draft<TableState>, action: PayloadAction<TableSortUpdate>) => {
        const { table, tab, sorts } = action.payload;
        state.tableSort[table] ??= {};
        state.tableSort[table][tab] = sorts;
    },
    setTableFilters: (state: Draft<TableState>, action: PayloadAction<TableFiltersUpdate>) => {
        const { filterType, filterSubType, filters } = action.payload;
        state.tableFilters.columnsFilters[filterType] ??= {};
        state.tableFilters.columnsFilters[filterType][filterSubType] = filters;
    },
};

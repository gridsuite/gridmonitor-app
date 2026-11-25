/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PayloadAction } from '@reduxjs/toolkit';
import { FilterConfig, SortConfig, TableColumnFilter, TableSort, TableType } from '@gridsuite/commons-ui';

export type SetTableSortPayload = {
    table: string;
    tab: string;
    sorts: SortConfig[];
};

export type SetTableFiltersPayload = {
    filterType: TableType;
    filterSubType: string;
    filters: FilterConfig[];
};

export type TableStateSlice = {
    tableSort: TableSort;
    tableFilters: TableColumnFilter;
};

export const tableStateReducers = {
    setTableSort: (state: TableStateSlice, action: PayloadAction<SetTableSortPayload>) => {
        const { table, tab, sorts } = action.payload;
        state.tableSort[table] ??= {};
        state.tableSort[table][tab] = sorts;
    },
    setTableFilters: (state: TableStateSlice, action: PayloadAction<SetTableFiltersPayload>) => {
        const { filterType, filterSubType, filters } = action.payload;
        state.tableFilters[filterType] ??= {};
        state.tableFilters[filterType][filterSubType] = filters;
    },
};

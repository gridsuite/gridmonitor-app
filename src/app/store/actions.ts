/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Action } from '@reduxjs/toolkit';
import { FilterConfig, SortConfig, TableSortKeysType, TableType } from '@gridsuite/commons-ui';

export const TABLE_SORT = 'TABLE_SORT';
export type TableSortAction = Readonly<Action<typeof TABLE_SORT>> & {
    table: TableSortKeysType;
    tab: string; // AppState['tableSort'][T];
    sort: SortConfig[];
};

export function setTableSort(table: TableSortKeysType, tab: string, sort: SortConfig[]): TableSortAction {
    return {
        type: TABLE_SORT,
        table,
        tab,
        sort,
    };
}

export const UPDATE_COLUMN_FILTERS = 'UPDATE_COLUMN_FILTERS';
export type UpdateColumnFiltersAction = {
    type: typeof UPDATE_COLUMN_FILTERS;
    filterType: TableType;
    filterSubType: string;
    filters: FilterConfig[];
};
export const updateColumnFiltersAction = (
    filterType: TableType,
    filterSubType: string,
    filters: FilterConfig[]
): UpdateColumnFiltersAction => ({
    type: UPDATE_COLUMN_FILTERS,
    filterType,
    filterSubType,
    filters,
});

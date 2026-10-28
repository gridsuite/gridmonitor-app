/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { FilterConfig, SortConfig, TableColumnFilter, TableSort, TableType } from '@gridsuite/commons-ui';

export type TableState = {
    tableSort: TableSort;
    tableFilters: {
        columnsFilters: TableColumnFilter;
    };
};

export type TableSortUpdate = {
    table: string;
    tab: string;
    sorts: SortConfig[];
};

export type TableFiltersUpdate = {
    filterType: TableType;
    filterSubType: string;
    filters: FilterConfig[];
};

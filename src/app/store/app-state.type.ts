/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FilterConfig, TableSort } from '@gridsuite/commons-ui';
import { UUID } from 'node:crypto';

interface TablesState {
    uuid: UUID | null;
}

export type TableFiltersState = {
    columnsFilters: Record<string, Record<string, FilterConfig[]>>;
};

export interface AppState {
    tableSort: TableSort;
    tables: TablesState;
    tableFilters: TableFiltersState;
}

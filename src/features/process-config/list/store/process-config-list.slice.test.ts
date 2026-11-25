/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { describe, expect, it } from 'vitest';
import { SortWay, TableType } from '@gridsuite/commons-ui';
import { processConfigListReducer, setTableFilters, setTableSort } from './process-config-list.slice';
import {
    PROCESS_CONFIG_ACTIVE_TAB,
    PROCESS_CONFIG_HISTORY_TAB,
    PROCESS_CONFIG_LIST_SORT_STORE,
} from './process-config-list.constants';

describe('processConfigList slice', () => {
    it('keeps sort and filters independent between the two tables', () => {
        const initial = processConfigListReducer(undefined, { type: 'init' });
        const sorted = processConfigListReducer(
            initial,
            setTableSort({
                table: PROCESS_CONFIG_LIST_SORT_STORE,
                tab: PROCESS_CONFIG_ACTIVE_TAB,
                sorts: [{ colId: 'processConfigChangedAt', sort: SortWay.DESC }],
            })
        );
        expect(sorted.tableSort[PROCESS_CONFIG_LIST_SORT_STORE][PROCESS_CONFIG_ACTIVE_TAB]).toHaveLength(1);
        expect(sorted.tableSort[PROCESS_CONFIG_LIST_SORT_STORE][PROCESS_CONFIG_HISTORY_TAB]).toEqual([]);

        const filtered = processConfigListReducer(
            sorted,
            setTableFilters({
                filterType: TableType.ProcessExecutionList,
                filterSubType: PROCESS_CONFIG_HISTORY_TAB,
                filters: [{ column: 'processType', value: 'LOADFLOW' } as never],
            })
        );
        const filters = filtered.tableFilters.columnsFilters[TableType.ProcessExecutionList];
        expect(filters[PROCESS_CONFIG_HISTORY_TAB]).toHaveLength(1);
        expect(filters[PROCESS_CONFIG_ACTIVE_TAB]).toEqual([]);
    });
});

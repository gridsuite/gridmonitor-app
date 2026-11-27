/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { describe, expect, it } from 'vitest';
import { SortWay } from '@gridsuite/commons-ui';
import { processConfigListReducer, setTableFilters, setTableSort } from './process-config-list.slice';
import { PROCESS_CONFIG_HISTORY, PROCESS_CONFIG_LIST } from './process-config-list.constants';

describe('processConfigList slice', () => {
    it('keeps sort and filters independent between the two tables', () => {
        const initial = processConfigListReducer(undefined, { type: 'init' });
        const sorted = processConfigListReducer(
            initial,
            setTableSort({
                table: PROCESS_CONFIG_LIST,
                tab: PROCESS_CONFIG_HISTORY,
                sorts: [{ colId: 'processConfigChangedAt', sort: SortWay.DESC }],
            })
        );
        expect(sorted.tableSort[PROCESS_CONFIG_LIST][PROCESS_CONFIG_HISTORY]).toHaveLength(1);

        const filtered = processConfigListReducer(
            sorted,
            setTableFilters({
                filterType: PROCESS_CONFIG_LIST,
                filterSubType: PROCESS_CONFIG_HISTORY,
                filters: [{ column: 'processType', value: 'LOADFLOW' } as never],
            })
        );
        const filters = filtered.tableFilters[PROCESS_CONFIG_LIST];
        expect(filters[PROCESS_CONFIG_HISTORY]).toHaveLength(1);
    });
});

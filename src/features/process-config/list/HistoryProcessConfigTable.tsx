/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useIntl } from 'react-intl';
import { useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { AutomaticProcessConfigInfos } from '../../../shared/api/monitor-api';
import { getHistoryColumns } from './ProcessConfigListUtil';
import { useAppSelector } from '../../../app/store/hooks';
import { PROCESS_CONFIG_HISTORY_TAB, PROCESS_CONFIG_LIST_SORT_STORE } from './store/process-config-list.constants';
import { ProcessConfigEnumsType } from './ProcessConfigTable.constants';
import { MonitorAGGrid } from '../../../shared/components/ag-grid/MonitorAGGrid';
import { BASE_DEFAULT_COL_DEF, SORTABLE_COL_DEF } from '../../../shared/components/ag-grid/ag-grid-default-col-def';
import { useAgGridTableState } from '../../../shared/hooks/use-ag-grid-table-state';
import { useEnumLabel } from '../../../shared/hooks/use-enum-label';

type HistoryProcessConfigTableProps = {
    configs: AutomaticProcessConfigInfos[];
};

const DEFAULT_COL_DEF: ColDef = { ...BASE_DEFAULT_COL_DEF, ...SORTABLE_COL_DEF, suppressMovable: true };

export function HistoryProcessConfigTable({ configs }: Readonly<HistoryProcessConfigTableProps>) {
    const gridRef = useRef<AgGridReact>(null);
    const intl = useIntl();
    const getEnumLabel = useEnumLabel();
    const tableSort = useAppSelector((state) => state.processConfigList.tableSort);
    const tableFilters = useAppSelector((state) => state.processConfigList.tableFilters);

    const { onGridReady } = useAgGridTableState({
        gridRef,
        tableSort,
        tableFilters,
        sortStore: PROCESS_CONFIG_LIST_SORT_STORE,
        tab: PROCESS_CONFIG_HISTORY_TAB,
    });

    const columns = useMemo(
        () => getHistoryColumns(intl, ProcessConfigEnumsType, getEnumLabel, PROCESS_CONFIG_HISTORY_TAB),
        [intl, getEnumLabel]
    );

    return (
        <MonitorAGGrid
            gridRef={gridRef}
            rowData={configs}
            columnDefs={columns}
            defaultColDef={DEFAULT_COL_DEF}
            onGridReady={onGridReady}
            height={300}
        />
    );
}

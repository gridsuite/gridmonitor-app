/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useIntl } from 'react-intl';
import { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import { AgGridReact } from 'ag-grid-react';
import { ProcessExecutionInfos } from '../models/process-execution';
import { processExecutionListColumnsDefinition } from './ProcessExecutionListUtil';
import { APP_PATHS } from '../../../app/router/paths';
import { useAppSelector } from '../../../app/store/hooks';
import { PROCESS_EXECUTION_LIST, PROCESS_EXECUTION_LIST_STORE } from './store/process-execution-list.constants';
import { MonitorAGGrid } from '../../../shared/components/ag-grid/MonitorAGGrid';
import { MONITOR_DEFAULT_COL_DEF_WITH_FRONTEND_FILTER } from '../../../shared/components/ag-grid/ag-grid-default-col-def';
import { useAgGridTableState } from '../../../shared/hooks/use-ag-grid-table-state';
import { useEnumLabel } from '../../../shared/hooks/use-enum-label';
import { monitorProcessConfigs } from '../../../shared/lib/process-configs';

type ProcessExecutionListTableProps = {
    executions: ProcessExecutionInfos[];
};

export const ProcessExecutionListEnumsType = {
    processType: monitorProcessConfigs,
    processStatus: ['SCHEDULED', 'RUNNING', 'FAILED', 'COMPLETED'],
};

const GRID_SX = {
    '& .row-action-button': {
        visibility: 'hidden',
    },
    '& .ag-row-hover .row-action-button': {
        visibility: 'visible',
    },
    '& .ag-row': {
        cursor: 'pointer',
    },
};

export function ProcessExecutionListTable({ executions }: Readonly<ProcessExecutionListTableProps>) {
    const gridRef = useRef<AgGridReact>(null);
    const intl = useIntl();
    const navigate = useNavigate();
    const getEnumLabel = useEnumLabel();
    const tableSort = useAppSelector((state) => state.processExecutionList.tableSort);
    const tableFilters = useAppSelector((state) => state.processExecutionList.tableFilters);

    console.log('FILTRE', tableFilters);
    const { onGridReady } = useAgGridTableState({
        gridRef,
        tableSort,
        tableFilters,
        sortStore: PROCESS_EXECUTION_LIST_STORE,
        tab: PROCESS_EXECUTION_LIST,
    });

    const columns = useMemo(
        () => processExecutionListColumnsDefinition(intl, ProcessExecutionListEnumsType, getEnumLabel),
        [intl, getEnumLabel]
    );

    return (
        <MonitorAGGrid
            gridRef={gridRef}
            rowData={executions}
            columnDefs={columns}
            defaultColDef={MONITOR_DEFAULT_COL_DEF_WITH_FRONTEND_FILTER}
            onGridReady={onGridReady}
            onRowClicked={({ data }) => navigate(APP_PATHS.process.stepInfos(data?.id ?? ''))}
            sx={GRID_SX}
        />
    );
}

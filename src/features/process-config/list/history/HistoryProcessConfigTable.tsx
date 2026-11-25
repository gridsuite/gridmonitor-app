/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FormattedMessage, useIntl } from 'react-intl';
import { useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Typography } from '@mui/material';
import { useGetAutomaticProcessConfigsHistoryQuery } from '../../../../shared/api/monitor-api';
import { getHistoryColumns } from '../ProcessConfigListUtil';
import { useAppSelector } from '../../../../app/store/hooks';
import { PROCESS_CONFIG_HISTORY, PROCESS_CONFIG_LIST } from '../store/process-config-list.constants';
import { MonitorAGGrid } from '../../../../shared/components/ag-grid/MonitorAGGrid';
import { MONITOR_DEFAULT_COL_DEF } from '../../../../shared/components/ag-grid/ag-grid-default-col-def';
import { useAgGridTableState } from '../../../../shared/hooks/use-ag-grid-table-state';
import { useEnumLabel } from '../../../../shared/hooks/use-enum-label';
import { ProcessConfigListProvider } from '../ProcessConfigListProvider';
import { monitorProcessConfigs } from '../../../../shared/lib/process-configs';

const historyProcessConfigFilterEnums = {
    processType: monitorProcessConfigs,
};

export function HistoryProcessConfigTable() {
    const { data: historyConfigs } = useGetAutomaticProcessConfigsHistoryQuery();

    const gridRef = useRef<AgGridReact>(null);
    const intl = useIntl();
    const getEnumLabel = useEnumLabel();
    const tableSort = useAppSelector((state) => state.processConfigList.tableSort);
    const tableFilters = useAppSelector((state) => state.processConfigList.tableFilters);

    const { onGridReady } = useAgGridTableState({
        gridRef,
        tableSort,
        tableFilters,
        sortStore: PROCESS_CONFIG_LIST,
        tab: PROCESS_CONFIG_HISTORY,
    });

    const columns = useMemo(
        () => getHistoryColumns(intl, historyProcessConfigFilterEnums, getEnumLabel),
        [intl, getEnumLabel]
    );

    return (
        <>
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                <FormattedMessage id="configsHistory" />
            </Typography>
            <ProcessConfigListProvider>
                <MonitorAGGrid
                    gridRef={gridRef}
                    rowData={historyConfigs}
                    columnDefs={columns}
                    defaultColDef={{ ...MONITOR_DEFAULT_COL_DEF, filter: true }}
                    onGridReady={onGridReady}
                    height={300}
                />
            </ProcessConfigListProvider>
        </>
    );
}

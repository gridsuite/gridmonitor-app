/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FormattedMessage, useIntl } from 'react-intl';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import {
    AutomaticProcessConfigInfos,
    ProcessType,
    useGetAutomaticProcessConfigsQuery,
} from '../../../../shared/api/monitor-api';
import { getActiveColumns } from '../ProcessConfigListUtil';
import { ChangeAutomaticProcessConfigDialog } from './ChangeAutomaticProcessConfigDialog';
import { MonitorAGGrid } from '../../../../shared/components/ag-grid/MonitorAGGrid';
import { MONITOR_DEFAULT_COL_DEF } from '../../../../shared/components/ag-grid/ag-grid-default-col-def';
import { useEnumLabel } from '../../../../shared/hooks/use-enum-label';
import { ProcessConfigListProvider } from '../ProcessConfigListProvider';
import { useAgGridTableState } from '../../../../shared/hooks/use-ag-grid-table-state';
import { PROCESS_CONFIG_ACTIVE, PROCESS_CONFIG_LIST } from '../store/process-config-list.constants';
import { useAppSelector } from '../../../../app/store/hooks';

export function ActiveProcessConfigTable() {
    const { data: activeConfigs } = useGetAutomaticProcessConfigsQuery();
    const gridRef = useRef<AgGridReact>(null);

    const intl = useIntl();
    const getEnumLabel = useEnumLabel();
    const [editedProcessType, setEditedProcessType] = useState<ProcessType | undefined>();

    const handleModify = useCallback((config: AutomaticProcessConfigInfos) => {
        setEditedProcessType(config.processType);
    }, []);

    const columns = useMemo(
        () => getActiveColumns(intl, getEnumLabel, handleModify),
        [intl, getEnumLabel, handleModify]
    );
    const tableSort = useAppSelector((state) => state.processConfigList.tableSort);

    const { onGridReady } = useAgGridTableState({
        gridRef,
        tableSort,
        sortStore: PROCESS_CONFIG_LIST,
        tab: PROCESS_CONFIG_ACTIVE,
    });

    return (
        <>
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                <FormattedMessage id="activeConfigs" />
            </Typography>
            {/* makeAgGridCustomHeaderColumn requires this provider even when filtering and sorting are not used. */}{' '}
            <ProcessConfigListProvider>
                <MonitorAGGrid
                    onGridReady={onGridReady}
                    rowData={activeConfigs}
                    columnDefs={columns}
                    defaultColDef={MONITOR_DEFAULT_COL_DEF}
                    height={300}
                />
            </ProcessConfigListProvider>
            {editedProcessType && (
                <ChangeAutomaticProcessConfigDialog
                    open
                    processType={editedProcessType}
                    onClose={() => setEditedProcessType(undefined)}
                />
            )}
        </>
    );
}

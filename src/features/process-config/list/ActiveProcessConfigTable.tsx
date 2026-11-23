/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, useTheme } from '@mui/material';
import { yellow } from '@mui/material/colors';
import { useIntl } from 'react-intl';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { CustomAGGrid, DefaultCellRenderer, TableType, updateAgGridFilters } from '@gridsuite/commons-ui';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, RowStyle } from 'ag-grid-community';
import { AutomaticProcessConfigInfos } from '../../../shared/api/monitor-api';
import { getActiveColumns } from './ProcessConfigListUtil';
import { AGGRID_LOCALES } from '../../../shared/translations/not-intl/aggrid-locales';
import { useAppSelector } from '../../../app/store/hooks';
import { PROCESS_CONFIG_ACTIVE_TAB, PROCESS_CONFIG_LIST_SORT_STORE } from './store/process-config-list.constants';

type ActiveProcessConfigTableProps = {
    configs: AutomaticProcessConfigInfos[];
};

export const ProcessConfigEnumsType = {
    processType: ['SECURITY_ANALYSIS', 'LOADFLOW', 'SHORT_CIRCUIT'],
};

export function ActiveProcessConfigTable({ configs }: Readonly<ActiveProcessConfigTableProps>) {
    const theme = useTheme();
    const gridRef = useRef<AgGridReact>(null);
    const intl = useIntl();
    const tableSort = useAppSelector((state) => state.processConfigList.tableSort);
    const tableFilters = useAppSelector((state) => state.processConfigList.tableFilters);

    const applyTableState = useCallback(
        (api: GridApi) => {
            api.applyColumnState({
                state: tableSort[PROCESS_CONFIG_LIST_SORT_STORE]?.[PROCESS_CONFIG_ACTIVE_TAB] ?? [],
                defaultState: { sort: null },
            });
            updateAgGridFilters(
                api,
                tableFilters.columnsFilters?.[TableType.ProcessExecutionList]?.[PROCESS_CONFIG_ACTIVE_TAB]
            );
        },
        [tableSort, tableFilters]
    );

    useEffect(() => {
        gridRef.current?.api?.applyColumnState({
            state: tableSort[PROCESS_CONFIG_LIST_SORT_STORE]?.[PROCESS_CONFIG_ACTIVE_TAB] ?? [],
            defaultState: { sort: null },
        });
    }, [tableSort]);

    useEffect(() => {
        updateAgGridFilters(
            gridRef.current?.api,
            tableFilters.columnsFilters?.[TableType.ProcessExecutionList]?.[PROCESS_CONFIG_ACTIVE_TAB]
        );
    }, [tableFilters]);

    const defaultColDef = useMemo(
        () => ({
            filter: true,
            sortable: true,
            resizable: true,
            lockPinned: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            cellRenderer: DefaultCellRenderer,
        }),
        []
    );

    const getEnumLabel = useCallback(
        (value: string) => intl.formatMessage({ id: value, defaultMessage: value }),
        [intl]
    );

    const columns = useMemo(
        () => getActiveColumns(intl, ProcessConfigEnumsType, getEnumLabel, PROCESS_CONFIG_ACTIVE_TAB),
        [intl, getEnumLabel]
    );

    const getCustomRowStyle = useCallback(() => {
        const style: RowStyle = {
            background: theme.palette.background.default,
            highlightColor: yellow[500],
        };
        return { ...style };
    }, [theme]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: 300, width: '100%', ml: 1 }}>
            <CustomAGGrid
                ref={gridRef}
                rowData={configs}
                defaultColDef={defaultColDef}
                columnDefs={columns}
                overrideLocales={AGGRID_LOCALES}
                onGridReady={({ api }) => applyTableState(api)}
                onModelUpdated={({ api }) => {
                    if (api.getDisplayedRowCount()) {
                        api.hideOverlay();
                    } else {
                        api.showNoRowsOverlay();
                    }
                }}
                getRowStyle={getCustomRowStyle}
            />
        </Box>
    );
}

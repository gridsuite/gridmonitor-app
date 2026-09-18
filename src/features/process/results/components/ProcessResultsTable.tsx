/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, useTheme } from '@mui/material';
import { useIntl } from 'react-intl';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import { CustomAGGrid, DefaultCellRenderer, TableType } from '@gridsuite/commons-ui';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, RowStyle } from 'ag-grid-community';
import { useAppSelector } from 'app/store/store';
import { ProcessExecutionInfos } from '../models/process-result';
import { processResultsColumnsDefinition } from './ProcessResultsUtil';
import { PROCESS_PATHS } from '../../router/process-paths';
import { updateAgGridFilters } from '../custom-aggrid/custom-aggrid-filters/utils/aggrid-filters-utils';
import { PROCESS_EXECUTION_HISTORY_SORT_STORE } from '../store/process-results.constants';
import { AGGRID_LOCALES } from '../../../../shared/translations/not-intl/aggrid-locales';

type ProcessResultsListProps = {
    executions: ProcessExecutionInfos[];
};

export const ProcessResultsEnumsType = {
    processType: ['SECURITY_ANALYSIS', 'LOADFLOW', 'SHORT_CIRCUIT'],
    processStatus: ['SCHEDULED', 'RUNNING', 'FAILED', 'COMPLETED'],
};

export function ProcessResultsTable({ executions }: Readonly<ProcessResultsListProps>) {
    const theme = useTheme();
    const gridRef = useRef<AgGridReact>(null);
    const intl = useIntl();
    const navigate = useNavigate();
    const tableSort = useAppSelector((state) => state.processResults.tableSort);
    const tableFilters = useAppSelector((state) => state.processResults.tableFilters);

    const applyTableState = useCallback(
        (api: GridApi) => {
            const sortState = tableSort[PROCESS_EXECUTION_HISTORY_SORT_STORE]?.[PROCESS_EXECUTION_HISTORY_SORT_STORE];
            api.applyColumnState({
                state: sortState ?? [],
                defaultState: { sort: null },
            });

            const filters =
                tableFilters.columnsFilters?.[TableType.ProcessExecutionHistory]?.[
                    PROCESS_EXECUTION_HISTORY_SORT_STORE
                ];
            updateAgGridFilters(api, filters);
        },
        [tableSort, tableFilters]
    );

    useEffect(() => {
        const sortState = tableSort[PROCESS_EXECUTION_HISTORY_SORT_STORE]?.[PROCESS_EXECUTION_HISTORY_SORT_STORE];
        gridRef.current?.api?.applyColumnState({
            state: sortState ?? [],
            defaultState: { sort: null },
        });
    }, [tableSort]);

    useEffect(() => {
        const filters =
            tableFilters.columnsFilters?.[TableType.ProcessExecutionHistory]?.[PROCESS_EXECUTION_HISTORY_SORT_STORE];
        updateAgGridFilters(gridRef.current?.api, filters);
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
        (value: string) => {
            return intl.formatMessage({
                id: value,
                defaultMessage: value,
            });
        },
        [intl]
    );

    const columns = useMemo(() => {
        return processResultsColumnsDefinition(intl, ProcessResultsEnumsType, getEnumLabel);
    }, [intl, getEnumLabel]);

    const getCustomRowStyle = useCallback(
        (_cellData: any) => {
            const style: RowStyle = { background: theme.palette.background.default, highlightColor: 'yellow' };
            return {
                ...style,
            };
        },
        [theme]
    );

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
                ml: 1,
                '& .row-action-button': {
                    visibility: 'hidden',
                },
                '& .ag-row-hover .row-action-button': {
                    visibility: 'visible',
                },
                '& .ag-row': {
                    cursor: 'pointer',
                },
            }}
        >
            <CustomAGGrid
                ref={gridRef}
                rowData={executions}
                defaultColDef={defaultColDef}
                columnDefs={columns}
                overrideLocales={AGGRID_LOCALES}
                onGridReady={({ api }) => {
                    applyTableState(api);
                }}
                onRowClicked={({ data }) => {
                    navigate(PROCESS_PATHS.stepInfos(data.id ?? ''));
                }}
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

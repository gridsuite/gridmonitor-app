/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useMemo } from 'react';
import {
    TableType,
    mappingTabs,
    SHORTCIRCUIT_ANALYSIS_RESULT_SORT_STORE,
    RunningStatus,
    ShortCircuitAnalysisResultView,
    ShortCircuitAnalysisType,
    ManagedExportCsvButton,
    snackWithFallback,
    useSnackMessage,
} from '@gridsuite/commons-ui';
import { Box } from '@mui/material';
import { useIntl } from 'react-intl';
import type { DisplayedColumnsChangedEvent, GridReadyEvent, RowDataUpdatedEvent } from 'ag-grid-community';
import { ProcessStatus, downloadExecutionResultsCsv } from 'shared/api/monitor-api';
import { SHORT_CIRCUIT_RESULT_TYPES } from 'shared/api/monitor-api/result-subtypes';
import { useShortCircuitExecutionResults } from './hooks/use-execution-results';
import { CustomAggridReduxProvider } from '../providers/custom-aggrid-redux-provider';
import { EMPTY_RESULT_FILTERS, EMPTY_RESULT_SORT } from './result-column-filters';
import { prepareShortCircuitQuery, serializeResultQuery } from './result-query-adapters';
import { useResultPagination } from './hooks/use-result-pagination';
import { useAppSelector } from '../../../app/store/hooks';

const RESULT_TYPE = SHORT_CIRCUIT_RESULT_TYPES.AllBuses;
const FILTER_TAB = mappingTabs(ShortCircuitAnalysisType.ALL_BUSES);
const FILTER_ENUMS = {
    faultType: ['BUS', 'BRANCH'],
    limitType: ['LOW_SHORT_CIRCUIT_CURRENT', 'HIGH_SHORT_CIRCUIT_CURRENT'],
};
const noopGridReady = (_event: GridReadyEvent) => undefined;
const noopRowDataUpdated = (_event: RowDataUpdatedEvent) => undefined;
const noopDisplayedColumnsChanged = (_event: DisplayedColumnsChangedEvent) => undefined;

export function ShortCircuitExecutionResultTable({
    executionId,
    executionStatus,
}: Readonly<{ executionId: string; executionStatus?: ProcessStatus }>) {
    const intl = useIntl();
    const { snackError } = useSnackMessage();
    const sort = useAppSelector(
        (state) =>
            state.processTables.tableSort[SHORTCIRCUIT_ANALYSIS_RESULT_SORT_STORE]?.[FILTER_TAB] ?? EMPTY_RESULT_SORT
    );
    const filters = useAppSelector(
        (state) =>
            state.processTables.tableFilters.columnsFilters[TableType.ShortcircuitAnalysis]?.[FILTER_TAB] ??
            EMPTY_RESULT_FILTERS
    );
    const query = useMemo(() => prepareShortCircuitQuery(filters, sort), [filters, sort]);
    const { page, rowsPerPage, setPage, setRowsPerPage } = useResultPagination(
        JSON.stringify([executionId, RESULT_TYPE, query])
    );
    const { result, isError, isFetching } = useShortCircuitExecutionResults(executionId, true, {
        page,
        size: rowsPerPage,
        ...query,
    });
    const rows = result?.content ?? [];
    const count = result?.totalElements ?? 0;
    const isExportDisabled = isFetching || isError || rows.length === 0;

    const exportCsv = useCallback(async () => {
        await downloadExecutionResultsCsv({
            executionId,
            fileName: 'allBuses-results.zip',
            resultType: RESULT_TYPE,
            ...serializeResultQuery(query),
            csvExportRequest: {
                headers: [
                    'IDNode',
                    'busVoltageLevel',
                    'Type',
                    'Feeders',
                    'IscKA',
                    'LimitType',
                    'IscMinKA',
                    'IscMaxKA',
                    'PscMVA',
                ],
                enumValueTranslations: {},
                language: intl.locale,
            },
        });
    }, [executionId, intl.locale, query]);

    const handleExportError = useCallback(
        (error: unknown) => {
            snackWithFallback(snackError, error, { headerId: 'shortCircuitAnalysisCsvResultsError' });
        },
        [snackError]
    );

    return (
        <CustomAggridReduxProvider>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    minWidth: 0,
                    minHeight: 0,
                    width: '100%',
                    overflow: 'hidden',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexShrink: 0, mb: 1 }}>
                    <ManagedExportCsvButton
                        exportCsv={exportCsv}
                        resetKey={`${executionId}-${RESULT_TYPE}`}
                        disabled={isExportDisabled}
                        onError={handleExportError}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        minWidth: 0,
                        minHeight: 0,
                        width: '100%',
                        overflow: 'hidden',
                        '& > .MuiBox-root:first-of-type': { flexShrink: 0 },
                        '& > .MuiBox-root:nth-of-type(2)': {
                            display: 'flex',
                            flex: '1 1 0%',
                            minWidth: 0,
                            minHeight: 0,
                            width: '100%',
                            overflow: 'hidden',
                        },
                        '& > .MuiBox-root:nth-of-type(2) > .MuiBox-root': {
                            flex: '1 1 0%',
                            minWidth: 0,
                            minHeight: 0,
                            width: '100%',
                        },
                    }}
                >
                    <ShortCircuitAnalysisResultView
                        result={rows}
                        analysisType={ShortCircuitAnalysisType.ALL_BUSES}
                        isFetching={isFetching}
                        filterEnums={FILTER_ENUMS}
                        columnFilters={filters}
                        analysisStatus={
                            isError || executionStatus === ProcessStatus.Failed
                                ? RunningStatus.FAILED
                                : RunningStatus.SUCCEED
                        }
                        pagination={{
                            count,
                            page,
                            rowsPerPage,
                            onPageChange: (_event, newPage) => setPage(newPage),
                            onRowsPerPageChange: (event) => {
                                setRowsPerPage(Number.parseInt(event.target.value, 10));
                                setPage(0);
                            },
                        }}
                        onRowDataUpdated={noopRowDataUpdated}
                        onDisplayedColumnsChanged={noopDisplayedColumnsChanged}
                        onGridReady={noopGridReady}
                    />
                </Box>
            </Box>
        </CustomAggridReduxProvider>
    );
}

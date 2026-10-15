/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useMemo, useState } from 'react';
import { useAppSelector } from 'app/store/store';
import {
    TableType,
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
import { ProcessStatus, ProcessType, useExportExecutionResultsCsvMutation } from 'shared/api/monitor-api';
import { SHORT_CIRCUIT_RESULT_TYPES } from 'shared/api/monitor-api/result-subtypes';
import { useExecutionResults } from '../hooks/use-execution-results';
import { CustomAggridReduxProvider } from './custom-aggrid-redux-provider';

const RESULT_TYPE = SHORT_CIRCUIT_RESULT_TYPES.AllBuses;
const noopGridReady = (_event: GridReadyEvent) => undefined;
const noopRowDataUpdated = (_event: RowDataUpdatedEvent) => undefined;
const noopDisplayedColumnsChanged = (_event: DisplayedColumnsChangedEvent) => undefined;

export function ShortCircuitExecutionResultTable({
    executionId,
    executionStatus,
}: Readonly<{ executionId: string; executionStatus?: ProcessStatus }>) {
    const intl = useIntl();
    const { snackError } = useSnackMessage();
    const [exportExecutionResultsCsv] = useExportExecutionResultsCsvMutation();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const sort = useAppSelector(
        (state) => state.processResults.tableSort[TableType.ShortcircuitAnalysis]?.[RESULT_TYPE] ?? []
    );
    const filters = useAppSelector(
        (state) => state.processResults.tableFilters.columnsFilters[TableType.ShortcircuitAnalysis]?.[RESULT_TYPE] ?? []
    );
    const { result, isError, isFetching } = useExecutionResults(executionId, ProcessType.ShortCircuit, true, {
        resultType: RESULT_TYPE,
        page,
        size: rowsPerPage,
        sort,
        filters,
    });
    const resultPage = useMemo(
        () => (result as { content?: unknown[]; totalElements?: number } | null) ?? {},
        [result]
    );
    const rows = resultPage.content ?? [];
    const count = resultPage.totalElements ?? 0;
    const isExportDisabled = isFetching || isError || rows.length === 0;

    const exportCsv = useCallback(async () => {
        const response = await exportExecutionResultsCsv({
            executionId,
            resultType: RESULT_TYPE,
            body: {
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
        }).unwrap();
        const url = URL.createObjectURL(response);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'allBuses-results.zip';
        anchor.click();
        URL.revokeObjectURL(url);
    }, [executionId, exportExecutionResultsCsv, intl.locale]);

    const handleExportError = useCallback(
        (error: unknown) => {
            snackWithFallback(snackError, error, { headerId: 'shortCircuitAnalysisCsvResultsError' });
        },
        [snackError]
    );

    return (
        <CustomAggridReduxProvider>
            <Box sx={{ height: 600, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                    <ManagedExportCsvButton
                        exportCsv={exportCsv}
                        resetKey={`${executionId}-${RESULT_TYPE}`}
                        disabled={isExportDisabled}
                        onError={handleExportError}
                    />
                </Box>
                <Box sx={{ height: 500, minHeight: 0 }}>
                    <ShortCircuitAnalysisResultView
                        result={rows as never}
                        analysisType={ShortCircuitAnalysisType.ALL_BUSES}
                        isFetching={isFetching}
                        filterEnums={{}}
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

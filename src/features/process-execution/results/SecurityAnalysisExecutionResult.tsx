/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SyntheticEvent, useCallback, useMemo, useState } from 'react';
import {
    TableType,
    ManagedExportCsvButton,
    MuiStyles,
    NmkType,
    RunningStatus,
    SecurityAnalysisResultNmk,
    snackWithFallback,
    useIntlResultStatusMessages,
    useSnackMessage,
} from '@gridsuite/commons-ui';
import {
    SECURITY_ANALYSIS_RESULT_TYPES,
    type SecurityAnalysisResultType,
} from 'shared/api/monitor-api/result-subtypes';
import { Box, Tab, Tabs } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { ProcessStatus, downloadExecutionResultsCsv } from 'shared/api/monitor-api';
import type { ColDef, GridReadyEvent } from 'ag-grid-community';
import { useSecurityAnalysisExecutionResults } from './hooks/use-execution-results';
import { useResultPagination } from './hooks/use-result-pagination';
import { ProcessExecutionResultsTableProvider } from './providers/ProcessExecutionResultsTableProvider';
import { EMPTY_RESULT_FILTERS, EMPTY_RESULT_SORT, makeResultFilterColumn } from './result-column-filters';
import { prepareSecurityAnalysisQuery, serializeResultQuery } from './result-query-adapters';
import { useAppSelector } from '../../../app/store/hooks';

const styles = {
    toolbarRow: {
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        width: '100%',
        mb: 1,
    },
    loader: {
        height: '4px',
    },
    resultContainer: {
        flexGrow: 1,
    },
    exportActions: {
        gridColumn: 3,
        display: 'flex',
        justifySelf: 'end',
        alignItems: 'center',
        gap: 2,
    },
} as const satisfies MuiStyles;

const COLUMN_FIELDS_BY_RESULT_TYPE: Record<NmkType, string[]> = {
    [NmkType.CONSTRAINTS_FROM_CONTINGENCIES]: [
        'contingencyId',
        'status',
        'subjectId',
        'limitType',
        'locationId',
        'limitName',
        'loading',
        'patlLoading',
        'acceptableDuration',
        'upcomingAcceptableDuration',
        'nextLimitName',
        'limit',
        'patlLimit',
        'value',
        'side',
    ],
    [NmkType.CONTINGENCIES_FROM_CONSTRAINTS]: [
        'subjectId',
        'contingencyId',
        'status',
        'limitType',
        'locationId',
        'limitName',
        'loading',
        'patlLoading',
        'acceptableDuration',
        'upcomingAcceptableDuration',
        'nextLimitName',
        'limit',
        'patlLimit',
        'value',
        'side',
    ],
    [NmkType.CUT_OFF_POWER_FROM_CONSTRAINTS]: [
        'contingencyId',
        'status',
        'disconnectedLoadActivePower',
        'disconnectedGenerationActivePower',
    ],
};

const COLUMN_LABELS: Record<string, string> = {
    contingencyId: 'results.columns.contingencyId',
    status: 'results.columns.status',
    subjectId: 'Equipment',
    locationId: 'Bus',
    limitType: 'ViolationType',
    limitName: 'LimitNameCurrentViolation',
    loading: 'LimitLoading',
    patlLoading: 'PatlLoading',
    acceptableDuration: 'actualOverloadDuration',
    upcomingAcceptableDuration: 'upComingOverloadDuration',
    nextLimitName: 'NextLimitNameCurrentViolation',
    limit: 'LimitLabelAOrKv',
    patlLimit: 'PatlLimitValue',
    value: 'CalculatedValue',
    side: 'LimitSide',
    disconnectedLoadActivePower: 'disconnectedLoadActivePower',
    disconnectedGenerationActivePower: 'disconnectedGenerationActivePower',
};

const noopGridReady = (_event: GridReadyEvent) => undefined;

export const NMK_SUBTABS = [
    { messageId: 'ConstraintsFromContingencies', value: NmkType.CONSTRAINTS_FROM_CONTINGENCIES },
    { messageId: 'ContingenciesFromConstraints', value: NmkType.CONTINGENCIES_FROM_CONSTRAINTS },
    { messageId: 'CutOffPowerFromConstraints', value: NmkType.CUT_OFF_POWER_FROM_CONSTRAINTS },
] as const;

const RESULT_TYPES: Record<NmkType, SecurityAnalysisResultType> = {
    [NmkType.CONSTRAINTS_FROM_CONTINGENCIES]: SECURITY_ANALYSIS_RESULT_TYPES.NmkContingencies,
    [NmkType.CONTINGENCIES_FROM_CONSTRAINTS]: SECURITY_ANALYSIS_RESULT_TYPES.NmkLimitViolations,
    [NmkType.CUT_OFF_POWER_FROM_CONSTRAINTS]: SECURITY_ANALYSIS_RESULT_TYPES.NmkCutOffPower,
};

export function SecurityAnalysisExecutionResultTable({
    executionId,
    executionStatus,
}: Readonly<{ executionId: string; executionStatus?: ProcessStatus }>) {
    const intl = useIntl();
    const { snackError } = useSnackMessage();
    const [nmkType, setNmkType] = useState(NmkType.CONSTRAINTS_FROM_CONTINGENCIES);
    const resultType = RESULT_TYPES[nmkType];
    const sort = useAppSelector(
        (state) => state.processExecutionResults.tableSort[TableType.SecurityAnalysis]?.[nmkType] ?? EMPTY_RESULT_SORT
    );
    const filters = useAppSelector(
        (state) =>
            state.processExecutionResults.tableFilters.columnsFilters[TableType.SecurityAnalysis]?.[nmkType] ??
            EMPTY_RESULT_FILTERS
    );
    const query = useMemo(
        () => prepareSecurityAnalysisQuery(filters, sort, resultType, intl),
        [filters, sort, resultType, intl]
    );
    const { page, rowsPerPage, setPage, setRowsPerPage } = useResultPagination(
        JSON.stringify([executionId, resultType, query])
    );
    const {
        result: sourcePage,
        isError,
        isFetching,
    } = useSecurityAnalysisExecutionResults(executionId, true, {
        resultType,
        page,
        size: rowsPerPage,
        ...query,
    });
    const resultPage = sourcePage ?? { content: [], totalElements: 0 };
    const messages = useIntlResultStatusMessages(intl, true, filters.length > 0);
    const columns = useMemo<ColDef[]>(
        () =>
            COLUMN_FIELDS_BY_RESULT_TYPE[nmkType].map((field) =>
                makeResultFilterColumn(
                    field,
                    intl.formatMessage({ id: COLUMN_LABELS[field], defaultMessage: field }),
                    TableType.SecurityAnalysis,
                    nmkType,
                    intl
                )
            ),
        [intl, nmkType]
    );
    const content = resultPage.content ?? [];
    const count = resultPage.totalElements ?? content.length;
    const isExportButtonDisabled = isFetching || isError || content.length === 0;

    const handleExportError = useCallback(
        (error: unknown) => {
            snackWithFallback(snackError, error, { headerId: 'securityAnalysisCsvResultsError' });
        },
        [snackError]
    );

    const exportCsv = useCallback(async () => {
        await downloadExecutionResultsCsv({
            executionId,
            fileName: `${resultType}-results.zip`,
            resultType,
            ...serializeResultQuery(query),
            csvExportRequest: {
                headers: columns.map((column) => column.headerName ?? column.field ?? ''),
                enumValueTranslations: {
                    CURRENT: intl.formatMessage({ id: 'CURRENT', defaultMessage: 'CURRENT' }),
                    HIGH_VOLTAGE: intl.formatMessage({ id: 'HIGH_VOLTAGE', defaultMessage: 'HIGH_VOLTAGE' }),
                    LOW_VOLTAGE: intl.formatMessage({ id: 'LOW_VOLTAGE', defaultMessage: 'LOW_VOLTAGE' }),
                    CONVERGED: intl.formatMessage({ id: 'CONVERGED', defaultMessage: 'CONVERGED' }),
                    FAILED: intl.formatMessage({ id: 'FAILED', defaultMessage: 'FAILED' }),
                },
                language: intl.locale,
            },
        });
    }, [columns, executionId, intl, resultType, query]);

    const handleChangeNmkType = (_event: SyntheticEvent, newValue: NmkType) => {
        setPage(0);
        setNmkType(newValue);
    };

    return (
        <ProcessExecutionResultsTableProvider>
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}>
                <Box sx={{ ...styles.toolbarRow, flexShrink: 0 }}>
                    <Box sx={{ justifySelf: 'start' }}>
                        <Tabs value={nmkType} onChange={handleChangeNmkType}>
                            {NMK_SUBTABS.map(({ messageId, value }) => (
                                <Tab key={value} label={<FormattedMessage id={messageId} />} value={value} />
                            ))}
                        </Tabs>
                    </Box>
                    <Box sx={styles.exportActions}>
                        <ManagedExportCsvButton
                            exportCsv={exportCsv}
                            resetKey={nmkType}
                            disabled={isExportButtonDisabled}
                            onError={handleExportError}
                        />
                    </Box>
                </Box>

                <Box sx={{ flex: 1, minHeight: 0 }}>
                    <SecurityAnalysisResultNmk
                        key={nmkType}
                        result={resultPage}
                        count={count}
                        columnDefs={columns}
                        isLoadingResult={isFetching}
                        nmkType={nmkType}
                        onGridReady={noopGridReady}
                        resultStatusMessages={messages}
                        securityAnalysisStatus={
                            isError || executionStatus === ProcessStatus.Failed
                                ? RunningStatus.FAILED
                                : RunningStatus.SUCCEED
                        }
                        paginationProps={{
                            count,
                            page,
                            rowsPerPage,
                            onPageChange: (_event, newPage) => setPage(newPage),
                            onRowsPerPageChange: (event) => {
                                setRowsPerPage(Number.parseInt(event.target.value, 10));
                                setPage(0);
                            },
                        }}
                    />
                </Box>
            </Box>
        </ProcessExecutionResultsTableProvider>
    );
}

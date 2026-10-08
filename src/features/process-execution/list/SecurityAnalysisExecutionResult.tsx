/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SyntheticEvent, useCallback, useMemo, useState } from 'react';
import { useAppSelector } from 'app/store/store';
import {
    TableType,
    ManagedExportCsvButton,
    MuiStyles,
    NmkType,
    RunningStatus,
    SecurityAnalysisNmkResult,
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
import { ProcessType, StepStatus, useExportExecutionResultsCsvMutation } from 'shared/api/monitor-api';
import type { ColDef, GridReadyEvent } from 'ag-grid-community';
import { useExecutionResults } from '../hooks/use-execution-results';

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
    contingencyId: 'Contingency',
    status: 'ComputationStatus',
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

function getPage(result: unknown): SecurityAnalysisNmkResult {
    return (result as SecurityAnalysisNmkResult | null) ?? { content: [], totalElements: 0 };
}

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
    resultStatus,
}: Readonly<{ executionId: string; resultStatus?: StepStatus }>) {
    const intl = useIntl();
    const { snackError } = useSnackMessage();
    const [exportExecutionResultsCsv] = useExportExecutionResultsCsvMutation();
    const [page, setPage] = useState(0);
    const [nmkType, setNmkType] = useState(NmkType.CONSTRAINTS_FROM_CONTINGENCIES);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const resultType = RESULT_TYPES[nmkType];
    const sort = useAppSelector((state) => state.processResults.tableSort[TableType.SecurityAnalysis]?.[nmkType] ?? []);
    const filters = useAppSelector(
        (state) => state.processResults.tableFilters.columnsFilters[TableType.SecurityAnalysis]?.[nmkType] ?? []
    );
    const { result, isError, isFetching } = useExecutionResults(executionId, ProcessType.SecurityAnalysis, true, {
        resultType,
        page,
        size: rowsPerPage,
        sort,
        filters,
    });
    const sourcePage = useMemo(() => getPage(result), [result]);
    const messages = useIntlResultStatusMessages(intl, true);
    const columns = useMemo<ColDef[]>(
        () =>
            COLUMN_FIELDS_BY_RESULT_TYPE[nmkType].map((field) => ({
                field,
                headerName: intl.formatMessage({
                    id: COLUMN_LABELS[field],
                    defaultMessage: field,
                }),
            })),
        [intl, nmkType]
    );
    const content = sourcePage.content ?? [];
    const count = sourcePage.totalElements ?? content.length;
    const isExportButtonDisabled = isFetching || isError || content.length === 0;

    const handleExportError = useCallback(
        (error: unknown) => {
            snackWithFallback(snackError, error, { headerId: 'securityAnalysisCsvResultsError' });
        },
        [snackError]
    );

    const exportCsv = useCallback(async () => {
        const response = await exportExecutionResultsCsv({
            executionId,
            resultType,
            body: {
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
        }).unwrap();

        const url = URL.createObjectURL(response);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${resultType}-results.zip`;
        anchor.click();
        URL.revokeObjectURL(url);
    }, [columns, executionId, exportExecutionResultsCsv, intl, resultType]);

    const handleChangeNmkType = (_event: SyntheticEvent, newValue: NmkType) => {
        setPage(0);
        setNmkType(newValue);
    };

    return (
        <Box>
            <Box sx={styles.toolbarRow}>
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

            <Box sx={{ height: 400, minHeight: 0 }}>
                <SecurityAnalysisResultNmk
                    result={sourcePage}
                    count={count}
                    columnDefs={columns}
                    isLoadingResult={isFetching}
                    nmkType={nmkType}
                    onGridReady={noopGridReady}
                    resultStatusMessages={messages}
                    securityAnalysisStatus={
                        isError || resultStatus === StepStatus.Failed ? RunningStatus.FAILED : RunningStatus.SUCCEED
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
    );
}

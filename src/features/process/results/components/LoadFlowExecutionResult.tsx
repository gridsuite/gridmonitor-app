/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com).
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, version 2.0.
 */

import { useMemo } from 'react';
import { Box } from '@mui/material';
import { useIntl } from 'react-intl';
import type { ColDef } from 'ag-grid-community';
import { LimitViolationResult, RunningStatus } from '@gridsuite/commons-ui';
import { ProcessType, StepStatus } from 'shared/api/monitor-api';
import { useExecutionResults } from '../hooks/use-execution-results';

const RESULT_TYPE = 'LIMIT_VIOLATIONS_CURRENT';
const COLUMN_FIELDS = [
    'subjectId',
    'limitName',
    'overload',
    'patlOverload',
    'actualOverloadDuration',
    'upComingOverloadDuration',
    'nextLimitName',
    'limit',
    'patlLimit',
    'value',
    'side',
];

export function LoadFlowExecutionResultTable({
    executionId,
    resultStatus,
}: Readonly<{ executionId: string; resultStatus?: StepStatus }>) {
    const intl = useIntl();
    const { result, isError, isFetching } = useExecutionResults(executionId, ProcessType.Loadflow, true, {
        resultType: RESULT_TYPE,
    });
    const violations = useMemo(() => (Array.isArray(result) ? result : []) as never, [result]);
    const columns = useMemo<ColDef[]>(
        () =>
            COLUMN_FIELDS.map((field) => ({
                field,
                headerName: intl.formatMessage({ id: `results.columns.${field}`, defaultMessage: field }),
            })),
        [intl]
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', pt: 3 }}>
            <Box sx={{ height: 600, minHeight: 0 }}>
                <LimitViolationResult
                    result={violations}
                    isLoadingResult={isFetching}
                    columnDefs={columns}
                    tableName={intl.formatMessage({ id: 'LoadFlowResultsCurrentViolations' })}
                    computationStatus={
                        isError || resultStatus === StepStatus.Failed ? RunningStatus.FAILED : RunningStatus.SUCCEED
                    }
                    computationSubType={RESULT_TYPE}
                    exportCsvResetKey={`${executionId}-${RESULT_TYPE}`}
                    language={intl.locale === 'fr' ? 'fr' : 'en'}
                />
            </Box>
        </Box>
    );
}

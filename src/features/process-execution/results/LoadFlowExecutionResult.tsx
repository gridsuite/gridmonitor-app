/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useMemo } from 'react';
import { Box } from '@mui/material';
import { useIntl } from 'react-intl';
import type { ColDef } from 'ag-grid-community';
import { LimitViolationResult, RunningStatus, TableType } from '@gridsuite/commons-ui';
import { useAppSelector } from 'app/store/store';
import { ProcessStatus } from 'shared/api/monitor-api';
import { CustomAggridReduxProvider } from '../list/custom-aggrid-redux-provider';
import { EMPTY_RESULT_FILTERS, EMPTY_RESULT_SORT, makeResultFilterColumn } from './result-column-filters';
import { prepareLoadFlowQuery } from './result-query-adapters';
import { useLoadFlowExecutionResults } from './hooks/use-execution-results';

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
    executionStatus,
}: Readonly<{ executionId: string; executionStatus?: ProcessStatus }>) {
    const intl = useIntl();
    const filters = useAppSelector(
        (state) =>
            state.processResults.tableFilters.columnsFilters[TableType.Loadflow]?.[RESULT_TYPE] ?? EMPTY_RESULT_FILTERS
    );
    const sort = useAppSelector(
        (state) => state.processResults.tableSort[TableType.Loadflow]?.[RESULT_TYPE] ?? EMPTY_RESULT_SORT
    );
    const query = useMemo(() => prepareLoadFlowQuery(filters, sort, intl), [filters, sort, intl]);
    const {
        result: violations,
        isError,
        isFetching,
    } = useLoadFlowExecutionResults(executionId, true, {
        resultType: RESULT_TYPE,
        ...query,
    });
    const columns = useMemo<ColDef[]>(
        () =>
            COLUMN_FIELDS.map((field) =>
                makeResultFilterColumn(
                    field,
                    intl.formatMessage({ id: `results.columns.${field}`, defaultMessage: field }),
                    TableType.Loadflow,
                    RESULT_TYPE,
                    intl
                )
            ),
        [intl]
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
                    pt: 3,
                    '& .MuiBox-root': { minHeight: 0 },
                }}
            >
                <Box sx={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                    <LimitViolationResult
                        result={violations}
                        isLoadingResult={isFetching}
                        columnDefs={columns}
                        tableName={intl.formatMessage({ id: 'LoadFlowResultsCurrentViolations' })}
                        computationStatus={
                            isError || executionStatus === ProcessStatus.Failed
                                ? RunningStatus.FAILED
                                : RunningStatus.SUCCEED
                        }
                        computationSubType={RESULT_TYPE}
                        exportCsvResetKey={`${executionId}-${RESULT_TYPE}`}
                        language={intl.locale === 'fr' ? 'fr' : 'en'}
                    />
                </Box>
            </Box>
        </CustomAggridReduxProvider>
    );
}

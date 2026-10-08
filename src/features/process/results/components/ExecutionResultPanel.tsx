/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Alert, Box, CircularProgress } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { ProcessType, StepStatus, useGetStepsInfosQuery } from 'shared/api/monitor-api';
import { useExecutionResults } from '../hooks/use-execution-results';
import { LoadFlowExecutionResultTable } from './LoadFlowExecutionResult';
import { SecurityAnalysisExecutionResultTable } from './SecurityAnalysisExecutionResult';
import { ShortCircuitExecutionResultTable } from './ShortCircuitExecutionResult';

export interface ExecutionResultPanelProps {
    executionId: string;
    processType: string;
}

function getResultStatus(steps: Array<{ resultType?: string; status?: StepStatus }>, processType: string) {
    const step =
        steps.find((candidate) => candidate.resultType === processType) ??
        steps.find((candidate) => candidate.resultType);
    return step?.status;
}

export function normalizeProcessType(processType: string): ProcessType | null {
    const normalized = processType
        .trim()
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .toUpperCase()
        .replaceAll('-', '_')
        .replace(/_CONFIG$/, '');
    switch (normalized) {
        case ProcessType.Loadflow:
        case 'LOAD_FLOW':
            return ProcessType.Loadflow;
        case ProcessType.SecurityAnalysis:
            return ProcessType.SecurityAnalysis;
        case ProcessType.ShortCircuit:
        case 'SHORTCIRCUIT':
            return ProcessType.ShortCircuit;
        default:
            return null;
    }
}

export function ExecutionResultPanel({ executionId, processType }: Readonly<ExecutionResultPanelProps>) {
    const intl = useIntl();
    const normalizedProcessType = normalizeProcessType(processType);
    const { currentData: steps = [] } = useGetStepsInfosQuery({ executionId });
    const resultStatus = getResultStatus(steps, normalizedProcessType ?? processType);
    const isSecurityAnalysis = normalizedProcessType === ProcessType.SecurityAnalysis;
    const isShortCircuit = normalizedProcessType === ProcessType.ShortCircuit;
    const { result, isError, isFetching } = useExecutionResults(
        executionId,
        normalizedProcessType ?? processType,
        normalizedProcessType !== null && !isSecurityAnalysis && !isShortCircuit
    );

    if (isSecurityAnalysis) {
        return <SecurityAnalysisExecutionResultTable executionId={executionId} resultStatus={resultStatus} />;
    }
    if (isShortCircuit) {
        return <ShortCircuitExecutionResultTable executionId={executionId} resultStatus={resultStatus} />;
    }

    if (isFetching && result === null) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress aria-label={intl.formatMessage({ id: 'LoadingRemoteData' })} />
            </Box>
        );
    }

    if (isError) {
        return (
            <Alert severity="error">
                <FormattedMessage id="executionResultsError" />
            </Alert>
        );
    }

    switch (normalizedProcessType) {
        case ProcessType.Loadflow:
            return <LoadFlowExecutionResultTable executionId={executionId} resultStatus={resultStatus} />;
        default:
            return (
                <Alert severity="info">
                    <FormattedMessage id="resultsNotAvailable" />
                </Alert>
            );
    }
}

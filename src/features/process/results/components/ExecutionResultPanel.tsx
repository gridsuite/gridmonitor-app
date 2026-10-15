/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Alert } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { ProcessStatus, ProcessType } from 'shared/api/monitor-api';
import { LoadFlowExecutionResultTable } from './LoadFlowExecutionResult';
import { SecurityAnalysisExecutionResultTable } from './SecurityAnalysisExecutionResult';
import { ShortCircuitExecutionResultTable } from './ShortCircuitExecutionResult';

export interface ExecutionResultPanelProps {
    executionId: string;
    processType: string;
    executionStatus: ProcessStatus;
}

export function ExecutionResultPanel({
    executionId,
    processType,
    executionStatus,
}: Readonly<ExecutionResultPanelProps>) {
    switch (processType) {
        case ProcessType.Loadflow:
            return <LoadFlowExecutionResultTable executionId={executionId} executionStatus={executionStatus} />;
        case ProcessType.SecurityAnalysis:
            return <SecurityAnalysisExecutionResultTable executionId={executionId} executionStatus={executionStatus} />;
        case ProcessType.ShortCircuit:
            return <ShortCircuitExecutionResultTable executionId={executionId} executionStatus={executionStatus} />;
        default:
            return (
                <Alert severity="info">
                    <FormattedMessage id="resultsNotAvailable" />
                </Alert>
            );
    }
}

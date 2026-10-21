/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Alert, Box } from '@mui/material';
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
    let ResultTable;
    switch (processType) {
        case ProcessType.Loadflow:
            ResultTable = LoadFlowExecutionResultTable;
            break;
        case ProcessType.SecurityAnalysis:
            ResultTable = SecurityAnalysisExecutionResultTable;
            break;
        case ProcessType.ShortCircuit:
            ResultTable = ShortCircuitExecutionResultTable;
            break;
        default:
            return (
                <Alert severity="info">
                    <FormattedMessage id="resultsNotAvailable" />
                </Alert>
            );
    }

    return (
        <Box sx={{ display: 'flex', flex: 1, minWidth: 0, minHeight: 0, width: '100%' }}>
            <ResultTable executionId={executionId} executionStatus={executionStatus} />
        </Box>
    );
}

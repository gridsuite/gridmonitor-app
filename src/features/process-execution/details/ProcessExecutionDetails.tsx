/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box } from '@mui/material';
import { ProcessStepInfosAlert } from './steps/ProcessStepInfosAlert';
import { useExecutionWithSteps } from './hooks/use-get-execution-with-steps';
import { ProcessExecutionDetailsView } from './ProcessExecutionDetailsView';

export function ProcessExecutionDetails({ processExecutionId }: Readonly<{ processExecutionId?: string }>) {
    const { execution, steps, isMissingExecutionId, isLoading, isError, isEmpty } =
        useExecutionWithSteps(processExecutionId);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, minWidth: 0 }}>
            <ProcessStepInfosAlert
                isEmpty={isEmpty}
                isError={isError}
                isLoading={isLoading}
                isMissingExecutionId={isMissingExecutionId}
            />
            {execution !== undefined && steps.length > 0 && (
                <Box sx={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                    <ProcessExecutionDetailsView execution={execution} steps={steps} />
                </Box>
            )}
        </Box>
    );
}

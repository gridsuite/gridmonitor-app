/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ProcessStepInfosAlert } from '../components/ProcessStepInfosAlert';
import { useExecutionWithSteps } from '../hooks/use-get-execution-with-steps';
import ProcessExecutionDetails from '../components/ProcessExecutionDetails';

function ProcessExecutionPage() {
    const { execution, steps, isMissingExecutionId, isLoading, isError, isEmpty } = useExecutionWithSteps();

    return (
        <>
            <ProcessStepInfosAlert
                isEmpty={isEmpty}
                isError={isError}
                isLoading={isLoading}
                isMissingExecutionId={isMissingExecutionId}
            />
            {execution !== undefined && steps.length > 0 && (
                <ProcessExecutionDetails execution={execution} steps={steps} />
            )}
        </>
    );
}

export default ProcessExecutionPage;

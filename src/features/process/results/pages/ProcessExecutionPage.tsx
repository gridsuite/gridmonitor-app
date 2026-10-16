/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useParams } from 'react-router';
import { ProcessStepInfosAlert } from '../components/execution/components/ProcessStepInfosAlert';
import { useExecutionWithSteps } from '../components/execution/hooks/use-get-execution-with-steps';
import ProcessExecutionDetails from '../components/execution/components/ProcessExecutionDetails';

function ProcessExecutionPage() {
    const { id } = useParams<{ id: string }>();
    const { execution, steps, isMissingExecutionId, isLoading, isError, isEmpty } = useExecutionWithSteps(id);

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

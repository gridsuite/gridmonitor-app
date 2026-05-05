/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ProcessStepInfosView } from '../components/ProcessStepInfosView';
import { ProcessStepInfosAlert } from '../components/ProcessStepInfosAlert';
import { useProcessStepInfos } from '../hooks/use-process-step-infos';

function ProcessStepInfosPage() {
    const { executionId, isEmpty, isError, isLoading, isMissingExecutionId, steps } = useProcessStepInfos();

    return (
        <>
            <ProcessStepInfosAlert
                isEmpty={isEmpty}
                isError={isError}
                isLoading={isLoading}
                isMissingExecutionId={isMissingExecutionId}
            />
            {!isMissingExecutionId && !isLoading && !isError && !isEmpty && executionId && (
                <ProcessStepInfosView executionId={executionId} steps={steps} />
            )}
        </>
    );
}

export default ProcessStepInfosPage;

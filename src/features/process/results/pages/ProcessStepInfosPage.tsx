/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ProcessStepInfos } from '../components/ProcessStepInfos';
import { ProcessStepInfosAlert } from '../components/ProcessStepInfosAlert';
import { useProcessStepInfos } from '../hooks/useProcessStepInfos';

export function ProcessStepInfosPage() {
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
                <ProcessStepInfos executionId={executionId} steps={steps} />
            )}
        </>
    );
}

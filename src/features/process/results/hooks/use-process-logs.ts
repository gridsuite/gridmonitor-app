/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    useGetExecutionQuery,
    useGetExecutionReportsQuery,
    useGetExecutionReportsSeveritiesQuery,
} from 'shared/api/monitor-api';
import { SeverityLevel, Report } from '@gridsuite/commons-ui';

export function useProcessLogs(executionId?: string) {
    const effectiveExecutionId = executionId ?? '';
    const skip = !executionId;

    const { currentData: execution, isError: isExecutionError } = useGetExecutionQuery(
        { executionId: effectiveExecutionId },
        { skip }
    );
    const {
        currentData: report,
        isError: isReportsError,
        isLoading: isReportLoading,
    } = useGetExecutionReportsQuery({ executionId: effectiveExecutionId }, { skip });
    const { currentData: severities } = useGetExecutionReportsSeveritiesQuery(
        { executionId: effectiveExecutionId },
        { skip }
    );

    return {
        execution,
        report: report as Report,
        severities: severities as SeverityLevel[],
        isError: isReportsError || isExecutionError,
        isEmpty: !isReportLoading && !report,
        isLoading: isReportLoading,
    };
}

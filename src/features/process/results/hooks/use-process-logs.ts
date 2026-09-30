/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useParams } from 'react-router';
import {
    useGetExecutionQuery,
    useGetExecutionReportsQuery,
    useGetExecutionReportsSeveritiesQuery,
} from 'shared/api/monitor-api';
import { SeverityLevel, Report } from '@gridsuite/commons-ui';

export function useProcessLogs() {
    const { id } = useParams<{ id: string }>();
    const executionId = id ?? '';
    const skip = !id;

    const { currentData: execution } = useGetExecutionQuery({ executionId }, { skip });
    const { currentData: report } = useGetExecutionReportsQuery({ executionId }, { skip });
    const { currentData: severities } = useGetExecutionReportsSeveritiesQuery({ executionId }, { skip });

    return {
        execution,
        report: report as Report,
        severities: severities as SeverityLevel[],
    };
}

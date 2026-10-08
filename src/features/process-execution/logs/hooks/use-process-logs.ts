/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useMemo } from 'react';
import {
    useGetExecutionQuery,
    useGetExecutionReportsQuery,
    useGetExecutionReportsSeveritiesQuery,
} from '../../../../shared/api/monitor-api';
import { Report, SeverityLevel, sortSeverityList } from '@gridsuite/commons-ui';

export function useProcessLogs(executionId: string) {
    const skip = !executionId;

    const { currentData: execution, isError: isExecutionError } = useGetExecutionQuery({ executionId }, { skip });
    const {
        currentData: report,
        isError: isReportsError,
        isLoading: isReportLoading,
    } = useGetExecutionReportsQuery({ executionId }, { skip });
    const { currentData: severities } = useGetExecutionReportsSeveritiesQuery({ executionId }, { skip });

    // sort severities
    const sortedSeverities = useMemo(() => {
        if (!severities) {
            return severities;
        }

        return sortSeverityList([
            ...severities /* spread because RTK uses Immer to keep the cached state immutable */,
        ] as SeverityLevel[]);
    }, [severities]);

    return {
        execution,
        report: report as Report,
        severities: sortedSeverities,
        isError: isReportsError || isExecutionError,
        isEmpty: !isReportLoading && !report,
        isLoading: isReportLoading,
    };
}

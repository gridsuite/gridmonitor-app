/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../rtk-query/base-api';

export const MonitorTags = {
    ProcessExecutions: 'ProcessExecutions',
    ProcessExecution: 'ProcessExecution',
    ProcessExecutionSteps: 'ProcessExecutionSteps',
    ProcessExecutionReports: 'ProcessExecutionReports',
    ProcessExecutionReportsSeverities: 'ProcessExecutionReportsSeverities',
} as const;

const serializeMonitorParams = (params: Record<string, unknown>) => {
    const query = new URLSearchParams();
    const { pageable, ...otherParams } = params;
    const page = pageable as { page?: number; size?: number; sort?: string[] } | undefined;

    Object.entries(otherParams).forEach(([key, value]) => {
        if (value != null) query.append(key, String(value));
    });
    if (page?.page != null) query.append('page', String(page.page));
    if (page?.size != null) query.append('size', String(page.size));
    page?.sort?.forEach((sort) => query.append('sort', sort));

    return query.toString();
};

export const monitorBaseApi = createApi({
    reducerPath: 'monitorApi',
    baseQuery: createBaseQuery(
        `${import.meta.env.VITE_API_GATEWAY}/monitor`,
        {
            exportExecutionResultsCsv: (response) => response.blob(),
        },
        serializeMonitorParams
    ),
    tagTypes: Object.values(MonitorTags),
    endpoints: () => ({}),
});

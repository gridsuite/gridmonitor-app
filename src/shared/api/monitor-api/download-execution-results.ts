/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { backendFetchFile } from '@gridsuite/commons-ui';
import type { ExportExecutionResultsCsvApiArg } from './monitor.generated';

function getQueryParams({
    resultType,
    sort,
    filters,
}: Omit<ExportExecutionResultsCsvApiArg, 'executionId' | 'csvExportRequest'>): URLSearchParams {
    const params = new URLSearchParams();
    if (resultType !== undefined) params.set('resultType', resultType);
    // The results API expects a separate sort parameter for each sorting criterion
    sort?.forEach((value) => params.append('sort', value));
    if (filters !== undefined) params.set('filters', filters);
    return params;
}

export async function downloadExecutionResultsCsv({
    executionId,
    csvExportRequest,
    fileName,
    ...params
}: ExportExecutionResultsCsvApiArg & { fileName: string }): Promise<void> {
    const blob = await backendFetchFile(
        `${import.meta.env.VITE_API_GATEWAY}/monitor/v1/executions/${encodeURIComponent(executionId)}/results/csv?${getQueryParams(params)}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(csvExportRequest),
        }
    );
    const anchor = document.createElement('a');
    const url = URL.createObjectURL(blob);
    try {
        anchor.href = url;
        anchor.download = fileName;
        document.body.appendChild(anchor);
        anchor.click();
    } finally {
        anchor.remove();
        URL.revokeObjectURL(url);
    }
}

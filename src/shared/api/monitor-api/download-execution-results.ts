/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { backendFetchFile } from '@gridsuite/commons-ui';
import { getExecutionResultsQueryParams } from './execution-results-query-params';
import type { ExportExecutionResultsCsvApiArg } from './monitor.generated';

export async function downloadExecutionResultsCsv({
    executionId,
    body,
    fileName,
    ...params
}: ExportExecutionResultsCsvApiArg & { fileName: string }): Promise<void> {
    const blob = await backendFetchFile(
        `${import.meta.env.VITE_API_GATEWAY}/monitor/v1/executions/${encodeURIComponent(executionId)}/results/csv?${getExecutionResultsQueryParams(params)}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
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

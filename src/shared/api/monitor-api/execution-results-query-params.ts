/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { GetExecutionResultsApiArg } from './monitor.generated';

// Adapt the generated Pageable argument to the results API's flat query parameters
export function getExecutionResultsQueryParams({
    resultType,
    pageable: { page, size, sort },
    filters,
}: Omit<GetExecutionResultsApiArg, 'executionId'>): URLSearchParams {
    const params = new URLSearchParams();
    if (resultType !== undefined) params.set('resultType', resultType);
    if (page !== undefined) params.set('page', String(page));
    if (size !== undefined) params.set('size', String(size));
    // The results API expects a separate sort parameter for each sorting criterion
    sort?.forEach((value) => params.append('sort', value));
    if (filters !== undefined) params.set('filters', filters);
    return params;
}

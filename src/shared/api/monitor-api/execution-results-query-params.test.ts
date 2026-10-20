/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { describe, expect, it } from 'vitest';
import { getExecutionResultsQueryParams } from './execution-results-query-params';

describe('getExecutionResultsQueryParams', () => {
    it('flattens pagination and repeats sort parameters', () => {
        const filters = JSON.stringify([{ column: 'subjectId', value: 'LINE & BUS+1' }]);
        const params = getExecutionResultsQueryParams({
            resultType: 'NMK_CONTINGENCIES',
            page: 0,
            size: 25,
            sort: ['subjectId,asc', 'value,desc'],
            filters,
        });

        expect([...params]).toEqual([
            ['resultType', 'NMK_CONTINGENCIES'],
            ['page', '0'],
            ['size', '25'],
            ['sort', 'subjectId,asc'],
            ['sort', 'value,desc'],
            ['filters', filters],
        ]);
    });

    it.each([undefined, []])('omits absent parameters with sort %j', (sort) => {
        const params = getExecutionResultsQueryParams({ sort });

        expect([...params]).toEqual([]);
    });
});

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { describe, expect, it } from 'vitest';
import { SECURITY_ANALYSIS_RESULT_TYPES } from 'shared/api/monitor-api/result-subtypes';
import { parseExecutionResult } from '../use-execution-results';

describe('parseExecutionResult', () => {
    it('parses a JSON result stored in the first array item', () => {
        expect(parseExecutionResult<{ content: number[] }>(['{"content":[1,2]}'])).toEqual({ content: [1, 2] });
    });

    it('parses a non-paginated load-flow result array', () => {
        expect(parseExecutionResult<number[]>(['[1,2]'])).toEqual([1, 2]);
    });

    it.each([undefined, [], ['']])('returns null for an empty API result', (raw) => {
        expect(parseExecutionResult(raw)).toBeNull();
    });

    it('returns null for invalid JSON', () => {
        expect(parseExecutionResult(['not-json'])).toBeNull();
    });

    it.each([
        [SECURITY_ANALYSIS_RESULT_TYPES.NmkContingencies, 'CONTINGENCY_1'],
        [SECURITY_ANALYSIS_RESULT_TYPES.NmkLimitViolations, 'LINE_2'],
        [SECURITY_ANALYSIS_RESULT_TYPES.NmkCutOffPower, 'CONTINGENCY_1'],
    ])('provides data shaped for the %s tab', (resultType, expectedId) => {
        const raw = JSON.stringify({
            content: [{ subjectId: expectedId }],
            totalElements: 2,
            totalPages: 1,
            size: 25,
            number: 0,
        });
        const page = JSON.parse(raw);
        expect(page).toMatchObject({
            content: expect.any(Array),
            totalElements: 2,
            totalPages: 1,
            size: 25,
            number: 0,
        });
        expect(
            page.content[0].contingency?.contingencyId ?? page.content[0].subjectId ?? page.content[0].contingencyId
        ).toBe(expectedId);
    });
});

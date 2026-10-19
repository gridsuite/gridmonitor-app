/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { describe, expect, it } from 'vitest';
import { createIntl } from 'react-intl';
import { type FilterConfig, SortWay } from '@gridsuite/commons-ui';
import { SECURITY_ANALYSIS_RESULT_TYPES } from 'shared/api/monitor-api/result-subtypes';
import {
    prepareLoadFlowQuery,
    prepareSecurityAnalysisQuery,
    prepareShortCircuitQuery,
    serializeResultQuery,
} from '../result-query-adapters';

const intl = createIntl({ locale: 'en', messages: { PermanentLimitName: 'Permanent', Undefined: 'Undefined' } });
const textFilter = (column: string, value: unknown): FilterConfig => ({
    column,
    value,
    type: 'contains',
    dataType: 'text',
});

describe('result query adapters', () => {
    it('maps load-flow durations and retains the fixed current constraint without duplicates', () => {
        const query = prepareLoadFlowQuery(
            [
                textFilter('subjectId', 'LINE'),
                { column: 'actualOverloadDuration', value: 60, type: 'equals', dataType: 'number' },
                textFilter('limitType', ['CURRENT']),
            ],
            [],
            intl
        );
        expect(query.filters).toEqual([
            textFilter('subjectId', 'LINE'),
            { column: 'actualOverload', value: 60, type: 'equals', dataType: 'number' },
            { column: 'limitType', value: ['CURRENT'], type: 'equals', dataType: 'text' },
        ]);
        expect(prepareLoadFlowQuery([], [], intl).filters).toEqual([query.filters[2]]);
    });

    it('maps short-circuit nested fields and scales numeric values and tolerances without mutating state', () => {
        const filters: FilterConfig[] = [
            textFilter('voltageLevel', 'VL'),
            textFilter('connectableId', 'FEEDER'),
            { column: 'current', value: '2.5', tolerance: 0.01, type: 'equals', dataType: 'number' },
        ];
        const query = prepareShortCircuitQuery(filters, [{ colId: 'elementId', sort: SortWay.ASC }]);
        expect(query.filters).toEqual([
            textFilter('fault.voltageLevelId', 'VL'),
            textFilter('feederResults.connectableId', 'FEEDER'),
            { column: 'current', value: 2500, tolerance: 10, type: 'equals', dataType: 'number' },
        ]);
        expect(query.sort).toEqual([{ colId: 'fault.id', sort: SortWay.ASC }]);
        expect(filters[2].value).toBe('2.5');
    });

    it.each([
        [
            SECURITY_ANALYSIS_RESULT_TYPES.NmkContingencies,
            'subjectId',
            'contingencyLimitViolations.subjectLimitViolation.subjectId',
        ],
        [
            SECURITY_ANALYSIS_RESULT_TYPES.NmkLimitViolations,
            'contingencyId',
            'contingencyLimitViolations.contingency.contingencyId',
        ],
        [
            SECURITY_ANALYSIS_RESULT_TYPES.NmkCutOffPower,
            'disconnectedLoadActivePower',
            'connectivityResult.disconnectedLoadActivePower',
        ],
    ])('maps filters and sorts for %s', (resultType, column, backendColumn) => {
        const query = prepareSecurityAnalysisQuery(
            [textFilter(column, 'value')],
            [{ colId: column, sort: SortWay.DESC }],
            resultType,
            intl
        );
        expect(query.filters).toEqual([textFilter(backendColumn, 'value')]);
        expect(query.sort).toEqual([{ colId: backendColumn, sort: SortWay.DESC }]);
    });

    it('translates displayed limit names and excludes filters irrelevant to the selected subtype', () => {
        const query = prepareSecurityAnalysisQuery(
            [
                textFilter('limitName', 'Permanent'),
                textFilter('nextLimitName', 'UNDEFINED'),
                textFilter('unknown', 'x'),
            ],
            [],
            SECURITY_ANALYSIS_RESULT_TYPES.NmkContingencies,
            intl
        );
        expect(query.filters.map(({ value }) => value)).toEqual(['permanent', 'N/A']);
        expect(
            prepareSecurityAnalysisQuery(
                [textFilter('limitName', 'Permanent')],
                [],
                SECURITY_ANALYSIS_RESULT_TYPES.NmkCutOffPower,
                intl
            ).filters
        ).toEqual([]);
    });

    it('serializes the same prepared query for exports, and omits filters after clearing', () => {
        const query = prepareShortCircuitQuery(
            [textFilter('faultType', ['BUS'])],
            [{ colId: 'elementId', sort: SortWay.ASC }]
        );
        expect(JSON.parse(serializeResultQuery(query).filters!)).toEqual(query.filters);
        expect(serializeResultQuery(query).pageable.sort).toEqual(['fault.id,asc']);
        expect(serializeResultQuery(prepareShortCircuitQuery([], [])).filters).toBeUndefined();
    });
});

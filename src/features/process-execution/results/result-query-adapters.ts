/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { type FilterConfig, type SortConfig, FROM_COLUMN_TO_FIELD, convertFilterValues } from '@gridsuite/commons-ui';
import type { IntlShape } from 'react-intl';
import {
    SECURITY_ANALYSIS_RESULT_TYPES,
    type SecurityAnalysisResultType,
} from 'shared/api/monitor-api/result-subtypes';

const LOAD_FLOW_FIELDS: Record<string, string> = {
    subjectId: 'subjectId',
    limitName: 'limitName',
    nextLimitName: 'nextLimitName',
    overload: 'overload',
    patlOverload: 'patlOverload',
    actualOverloadDuration: 'actualOverload',
    upComingOverloadDuration: 'upComingOverload',
    limit: 'limit',
    patlLimit: 'patlLimit',
    value: 'value',
    side: 'side',
    limitType: 'limitType',
};
const VIOLATION_FIELDS = [
    'locationId',
    'limitType',
    'limitName',
    'nextLimitName',
    'side',
    'acceptableDuration',
    'upcomingAcceptableDuration',
    'limit',
    'patlLimit',
    'value',
    'loading',
    'patlLoading',
];
const NESTED_VIOLATION_FIELDS = Object.fromEntries(
    VIOLATION_FIELDS.map((field) => [field, `contingencyLimitViolations.${field}`])
);
const SECURITY_FIELDS: Record<SecurityAnalysisResultType, Record<string, string>> = {
    [SECURITY_ANALYSIS_RESULT_TYPES.NmkContingencies]: {
        ...NESTED_VIOLATION_FIELDS,
        subjectId: 'contingencyLimitViolations.subjectLimitViolation.subjectId',
        contingencyId: 'contingencyId',
        status: 'status',
    },
    [SECURITY_ANALYSIS_RESULT_TYPES.NmkLimitViolations]: {
        ...NESTED_VIOLATION_FIELDS,
        subjectId: 'subjectId',
        contingencyId: 'contingencyLimitViolations.contingency.contingencyId',
        status: 'contingencyLimitViolations.contingency.status',
    },
    [SECURITY_ANALYSIS_RESULT_TYPES.NmkCutOffPower]: {
        contingencyId: 'contingencyId',
        status: 'status',
        disconnectedLoadActivePower: 'connectivityResult.disconnectedLoadActivePower',
        disconnectedGenerationActivePower: 'connectivityResult.disconnectedGenerationActivePower',
    },
};

function mapQuery(filters: FilterConfig[], sort: SortConfig[], fields: Record<string, string>) {
    return {
        filters: filters
            .filter((filter) => fields[filter.column])
            .map((filter) => ({
                ...filter,
                column: fields[filter.column],
            })),
        sort: sort
            .filter((entry) => fields[entry.colId])
            .map((entry) => ({
                ...entry,
                colId: fields[entry.colId],
            })),
    };
}

function translateLimitNames(filters: FilterConfig[], intl: IntlShape): FilterConfig[] {
    return filters.map((filter) => {
        if (filter.column !== 'limitName' && filter.column !== 'nextLimitName') {
            return filter;
        }
        let { value } = filter;
        if (value === intl.formatMessage({ id: 'PermanentLimitName' })) {
            value = 'permanent';
        } else if (value === intl.formatMessage({ id: 'Undefined' }).toUpperCase()) {
            value = 'N/A';
        }
        return { ...filter, value };
    });
}

export function prepareLoadFlowQuery(filters: FilterConfig[], sort: SortConfig[], intl: IntlShape) {
    const currentFilters = translateLimitNames(filters, intl).filter((filter) => filter.column !== 'limitType');
    currentFilters.push({ column: 'limitType', dataType: 'text', type: 'equals', value: ['CURRENT'] });
    return mapQuery(currentFilters, sort, LOAD_FLOW_FIELDS);
}

export function prepareShortCircuitQuery(filters: FilterConfig[], sort: SortConfig[]) {
    const convertedFilters = filters.map((filter) => {
        if (filter.type === 'blank' || filter.type === 'notBlank') {
            return filter;
        }
        const [converted] = convertFilterValues([filter]);
        return {
            ...converted,
            tolerance: filter.tolerance === undefined ? undefined : converted.tolerance,
        };
    });
    return mapQuery(convertedFilters, sort, FROM_COLUMN_TO_FIELD);
}

export function prepareSecurityAnalysisQuery(
    filters: FilterConfig[],
    sort: SortConfig[],
    resultType: SecurityAnalysisResultType,
    intl: IntlShape
) {
    return mapQuery(translateLimitNames(filters, intl), sort, SECURITY_FIELDS[resultType]);
}

export function serializeResultQuery(query: { filters: FilterConfig[]; sort: SortConfig[] }) {
    return {
        filters: query.filters.length ? JSON.stringify(query.filters) : undefined,
        pageable: {
            sort: query.sort.map(({ colId, sort }) => `${colId},${sort}`),
        },
    };
}

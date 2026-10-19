/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { ColDef } from 'ag-grid-community';
import type { IntlShape } from 'react-intl';
import {
    CustomAggridAutocompleteFilter,
    CustomAggridComparatorFilter,
    type CustomAggridAutocompleteFilterParams,
    FilterDataTypes,
    FilterNumberComparators,
    FilterTextComparators,
    makeAgGridCustomHeaderColumn,
    type TableType,
    type FilterConfig,
    type SortConfig,
} from '@gridsuite/commons-ui';

export const EMPTY_RESULT_FILTERS: FilterConfig[] = [];
export const EMPTY_RESULT_SORT: SortConfig[] = [];

const TEXT_FIELDS = new Set([
    'subjectId',
    'contingencyId',
    'locationId',
    'limitName',
    'nextLimitName',
    'side',
    'status',
    'limitType',
]);
const ENUM_OPTIONS: Record<string, string[]> = {
    side: ['ONE', 'TWO', 'THREE'],
    limitType: ['CURRENT', 'HIGH_VOLTAGE', 'LOW_VOLTAGE', 'ACTIVE_POWER', 'APPARENT_POWER'],
    status: ['CONVERGED', 'FAILED', 'MAX_ITERATION_REACHED', 'NO_CALCULATION'],
};

export function makeResultFilterColumn(
    field: string,
    headerName: string,
    type: TableType,
    tab: string,
    intl: IntlShape
): ColDef {
    const options = ENUM_OPTIONS[field];
    const sortParams = { table: type, tab };
    if (options) {
        return makeAgGridCustomHeaderColumn<CustomAggridAutocompleteFilterParams>({
            field,
            colId: field,
            headerName,
            filter: false,
            context: {
                sortParams,
                filterComponent: CustomAggridAutocompleteFilter,
                filterComponentParams: {
                    filterParams: { type, tab, dataType: FilterDataTypes.TEXT },
                    options,
                    getOptionLabel: (value: string) => intl.formatMessage({ id: value, defaultMessage: value }),
                },
            },
        });
    }
    const numeric = !TEXT_FIELDS.has(field);
    let comparators: string[] = [FilterTextComparators.STARTS_WITH, FilterTextComparators.CONTAINS];
    if (numeric) {
        comparators = Object.values(FilterNumberComparators);
    } else if (field === 'limitName' || field === 'nextLimitName') {
        comparators = [FilterTextComparators.EQUALS];
    }
    return makeAgGridCustomHeaderColumn({
        field,
        colId: field,
        headerName,
        filter: false,
        context: {
            numeric,
            filterComponent: CustomAggridComparatorFilter,
            filterComponentParams: {
                filterParams: {
                    type,
                    tab,
                    dataType: numeric ? FilterDataTypes.NUMBER : FilterDataTypes.TEXT,
                    comparators,
                },
            },
        },
    });
}

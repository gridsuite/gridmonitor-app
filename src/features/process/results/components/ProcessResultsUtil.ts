/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ColDef, IFilterOptionDef, ValueFormatterParams } from 'ag-grid-community';
import {
    makeAgGridCustomHeaderColumn,
    CustomAggridAutocompleteFilter,
    FilterEnumsType,
    SortParams,
    FilterDataTypes,
    TableType,
    UserCellRenderer,
    CustomAggridComparatorFilter,
    FilterTextComparators,
} from '@gridsuite/commons-ui';
import { IntlShape } from 'react-intl';
import { PROCESS_LAUNCH_HISTORY_SORT_STORE } from '@gridsuite/commons-ui/utils/store-sort-filter-fields';
import { ProcessStatusCellRenderer } from './renderers/process-status-cell-renderer';
import { ProcessDetailCellRenderer } from './renderers/process-detail-cell-renderer';
import { ProcessDateCellRenderer } from './renderers/process-date-cell-renderer';

interface TableParams {
    sortParams: SortParams;
    filterParams: {
        type: TableType;
        tab: string;
    };
}

const createTableParams = (): TableParams => {
    return {
        sortParams: {
            table: PROCESS_LAUNCH_HISTORY_SORT_STORE,
            tab: PROCESS_LAUNCH_HISTORY_SORT_STORE,
        },
        filterParams: {
            type: TableType.ProcessLaunchHistory,
            tab: PROCESS_LAUNCH_HISTORY_SORT_STORE,
        },
    };
};

const createEnumFilterParams = (): any => {
    return {
        filterOptions: [
            {
                displayKey: 'customInRange',
                displayName: 'customInRange', // translation key
                predicate: (filterValues: (string | number)[][], cellValue: string | number) => {
                    const allowedValues = filterValues[0];
                    // if allowedValues is empty there is no filter
                    if (!allowedValues || allowedValues.length === 0) {
                        return true;
                    }
                    // allowedValues contains the list of selected enum values.
                    return allowedValues.map(String).includes(String(cellValue));
                },
            },
        ] as IFilterOptionDef[],
    };
};

export const processResultsColumnsDefinition = (
    intl: IntlShape,
    filterEnums: FilterEnumsType,
    getEnumLabel: (value: string) => string // Used for translation of enum values in the filter
): ColDef[] => {
    const { sortParams, filterParams } = createTableParams();

    return [
        // Process type
        makeAgGridCustomHeaderColumn({
            headerName: intl.formatMessage({ id: 'ProcessType' }),
            colId: 'processType',
            field: 'type',
            filterParams: createEnumFilterParams(),
            context: {
                filterComponent: CustomAggridAutocompleteFilter,
                filterComponentParams: {
                    filterParams: {
                        dataType: FilterDataTypes.TEXT,
                        ...filterParams,
                    },
                    // @ts-ignore
                    options: filterEnums.processType ?? [],
                    getOptionLabel: getEnumLabel,
                },
            },
            valueGetter: (params) => params.data.type,
            valueFormatter: (params: ValueFormatterParams) => getEnumLabel(params.data.type),
        }),

        // Process status
        makeAgGridCustomHeaderColumn({
            headerName: intl.formatMessage({ id: 'ProcessStatus' }),
            colId: 'processStatus',
            field: 'status',
            cellRenderer: ProcessStatusCellRenderer,
            filterParams: createEnumFilterParams(),
            context: {
                filterComponent: CustomAggridAutocompleteFilter,
                filterComponentParams: {
                    filterParams: {
                        dataType: FilterDataTypes.TEXT,
                        ...filterParams,
                    },
                    // @ts-ignore
                    options: filterEnums.processStatus ?? [],
                    getOptionLabel: getEnumLabel,
                },
            },
            valueGetter: (params) => params.data.status,
            valueFormatter: (params: ValueFormatterParams) => getEnumLabel(params.data.status),
        }),

        // Process launched by
        makeAgGridCustomHeaderColumn({
            headerName: intl.formatMessage({ id: 'ProcessLaunchedBy' }),
            colId: 'processLaunchedBy',
            field: 'userId',
            cellRenderer: UserCellRenderer,
            minWidth: 110,
            flex: 1,
            context: {
                sortParams,
                filterComponent: CustomAggridComparatorFilter,
                filterComponentParams: {
                    filterParams: {
                        type: TableType.ProcessLaunchHistory,
                        tab: TableType.ProcessLaunchHistory,
                        dataType: FilterDataTypes.TEXT,
                        comparators: [FilterTextComparators.STARTS_WITH, FilterTextComparators.CONTAINS],
                        debounceMs: 500,
                    },
                },
            },
            valueGetter: (params) => params.data.userId,
        }),

        // Process scheduled at
        makeAgGridCustomHeaderColumn({
            headerName: intl.formatMessage({ id: 'ProcessScheduledAt' }),
            colId: 'processScheduledAt',
            field: 'scheduledAt',
            cellRenderer: ProcessDateCellRenderer,
            minWidth: 110,
            flex: 1,
            context: {
                sortParams,
            },
            valueGetter: (params) => params.data.scheduledAt,
        }),

        // Process started at
        makeAgGridCustomHeaderColumn({
            headerName: intl.formatMessage({ id: 'ProcessStartedAt' }),
            colId: 'processStartedAt',
            field: 'startedAt',
            cellRenderer: ProcessDateCellRenderer,
            minWidth: 110,
            flex: 1,
            context: {
                sortParams,
            },
            valueGetter: (params) => params.data.startedAt,
        }),

        // Process completed at
        makeAgGridCustomHeaderColumn({
            headerName: intl.formatMessage({ id: 'ProcessCompletedAt' }),
            colId: 'processCompletedAt',
            field: 'completedAt',
            cellRenderer: ProcessDateCellRenderer,
            minWidth: 110,
            flex: 1,
            context: {
                sortParams,
            },
            valueGetter: (params) => params.data.completedAt,
        }),

        // Process details
        makeAgGridCustomHeaderColumn({
            headerName: intl.formatMessage({ id: 'ProcessShowDetails' }),
            colId: 'ProcessShowDetails',
            field: 'ProcessShowDetails',
            cellRenderer: ProcessDetailCellRenderer,
        }),
    ];
};

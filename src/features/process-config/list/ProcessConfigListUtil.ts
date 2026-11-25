/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ColDef, IFilterOptionDef, ValueFormatterParams } from 'ag-grid-community';
import {
    CustomAggridAutocompleteFilter,
    CustomAggridAutocompleteFilterParams,
    CustomAggridComparatorFilter,
    FilterDataTypes,
    FilterEnumsType,
    FilterTextComparators,
    makeAgGridCustomHeaderColumn,
    TableType,
} from '@gridsuite/commons-ui';
import { IntlShape } from 'react-intl';
import { ConfigDateCellRenderer } from './renderers/config-date-cell-renderer';
import { ConfigUserCellRenderer } from './renderers/config-user-cell-renderer';
import { ConfigModifyCellRenderer } from './renderers/config-modify-cell-renderer';
import { AutomaticProcessConfigInfos } from '../../../shared/api/monitor-api';
import { PROCESS_CONFIG_LIST_SORT_STORE } from './store/process-config-list.constants';

const createTableParams = (tab: string) => ({
    sortParams: { table: PROCESS_CONFIG_LIST_SORT_STORE, tab },
    filterParams: { type: TableType.ProcessExecutionList, tab },
});

const createEnumFilterParams = (): any => ({
    filterOptions: [
        {
            displayKey: 'customInRange',
            displayName: 'customInRange',
            predicate: (filterValues: (string | number)[][], cellValue: string | number) => {
                const allowedValues = filterValues[0];
                if (!allowedValues || allowedValues.length === 0) {
                    return true;
                }
                return allowedValues.map(String).includes(String(cellValue));
            },
        },
    ] as IFilterOptionDef[],
});

const textFilterContext = (sortParams: any, filterParams: any) => ({
    sortParams,
    filterComponent: CustomAggridComparatorFilter,
    filterComponentParams: {
        filterParams: {
            dataType: FilterDataTypes.TEXT,
            comparators: [FilterTextComparators.STARTS_WITH, FilterTextComparators.CONTAINS],
            debounceMs: 500,
            ...filterParams,
        },
    },
});

type ColumnsArgs = {
    intl: IntlShape;
    filterEnums: FilterEnumsType;
    getEnumLabel: (value: string) => string;
    tab?: string;
};

// Without a tab, columns are neither sortable nor filterable through the store: no context, no filterParams
const typeColumn = ({ intl, filterEnums, getEnumLabel, tab }: ColumnsArgs): ColDef => {
    const params = tab ? createTableParams(tab) : undefined;
    return makeAgGridCustomHeaderColumn<CustomAggridAutocompleteFilterParams>({
        headerName: intl.formatMessage({ id: 'AnalysisType' }),
        colId: 'processType',
        field: 'processType',
        pinned: true,
        minWidth: 210,
        ...(params && {
            filterParams: createEnumFilterParams(),
            context: {
                filterComponent: CustomAggridAutocompleteFilter,
                filterComponentParams: {
                    filterParams: { dataType: FilterDataTypes.TEXT, ...params.filterParams },
                    options: filterEnums.processType ?? [],
                    getOptionLabel: getEnumLabel,
                },
            },
        }),
        valueGetter: (p) => p.data.processType,
        valueFormatter: (p: ValueFormatterParams) => getEnumLabel(p.data.processType),
    });
};

const nameColumn = ({ intl, tab }: ColumnsArgs): ColDef => {
    const params = tab ? createTableParams(tab) : undefined;
    return makeAgGridCustomHeaderColumn({
        headerName: intl.formatMessage({ id: 'Name' }),
        colId: 'processConfigName',
        field: 'processConfigName',
        minWidth: 300,
        ...(params && { context: textFilterContext(params.sortParams, params.filterParams) }),
        valueGetter: (p) => p.data.processConfigName,
    });
};

const sinceColumn = ({ intl, tab }: ColumnsArgs): ColDef => {
    const params = tab ? createTableParams(tab) : undefined;
    return makeAgGridCustomHeaderColumn({
        headerName: intl.formatMessage({ id: 'Since' }),
        colId: 'processConfigChangedAt',
        field: 'changedAt',
        minWidth: 183,
        maxWidth: 183,
        resizable: false,
        cellRenderer: ConfigDateCellRenderer,
        ...(params && { context: { sortParams: params.sortParams } }),
        valueGetter: (p) => p.data.changedAt,
    });
};

const modifiedByColumn = ({ intl, tab }: ColumnsArgs): ColDef => {
    const params = tab ? createTableParams(tab) : undefined;
    return makeAgGridCustomHeaderColumn({
        headerName: intl.formatMessage({ id: 'ModifiedBy' }),
        colId: 'processConfigChangedBy',
        field: 'changedBy',
        minWidth: 174,
        maxWidth: 174,
        resizable: false,
        cellRenderer: ConfigUserCellRenderer,
        cellRendererParams: { backgroundColor: 'text.secondary' },
        ...(params && { context: textFilterContext(params.sortParams, params.filterParams) }),
        valueGetter: (p) => p.data.changedBy,
    });
};

const modifyColumn = (onModify: (config: AutomaticProcessConfigInfos) => void): ColDef => ({
    colId: 'modify',
    headerName: '',
    sortable: false,
    filter: false,
    resizable: false,
    minWidth: 130,
    maxWidth: 130,
    cellRenderer: ConfigModifyCellRenderer,
    cellRendererParams: { onModify },
});

// this column is to make the row full width and to keep other column left aligned
// using sizeColumnsToFit makes columns too large
const fullWidthColumn = (): ColDef => ({
    flex: 1,
    sortable: false,
    filter: false,
    resizable: false,
});

export const getActiveColumns = (
    intl: IntlShape,
    filterEnums: FilterEnumsType,
    getEnumLabel: (value: string) => string,
    onModify: (config: AutomaticProcessConfigInfos) => void
): ColDef[] => {
    const args = { intl, filterEnums, getEnumLabel };
    return [
        typeColumn(args),
        nameColumn(args),
        sinceColumn(args),
        modifiedByColumn(args),
        modifyColumn(onModify),
        fullWidthColumn(),
    ];
};

export const getHistoryColumns = (
    intl: IntlShape,
    filterEnums: FilterEnumsType,
    getEnumLabel: (value: string) => string,
    tab: string
): ColDef[] => {
    const args = { intl, filterEnums, getEnumLabel, tab };
    return [typeColumn(args), nameColumn(args), sinceColumn(args), modifiedByColumn(args), fullWidthColumn()];
};

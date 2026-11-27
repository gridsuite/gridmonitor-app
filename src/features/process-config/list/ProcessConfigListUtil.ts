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
    FilterParams,
    FilterTextComparators,
    makeAgGridCustomHeaderColumn,
    SortParams,
} from '@gridsuite/commons-ui';
import { IntlShape } from 'react-intl';
import { ConfigDateCellRenderer } from './cell-renderers/config-date-cell-renderer';
import { ConfigUserCellRenderer } from './cell-renderers/config-user-cell-renderer';
import { ConfigModifyCellRenderer } from './cell-renderers/config-modify-cell-renderer';
import { AutomaticProcessConfigInfos } from '../../../shared/api/monitor-api';
import { PROCESS_CONFIG_HISTORY, PROCESS_CONFIG_LIST } from './store/process-config-list.constants';

const sortAndFilterParams = {
    sortParams: { table: PROCESS_CONFIG_LIST, tab: PROCESS_CONFIG_HISTORY },
    filterParams: { type: PROCESS_CONFIG_LIST, tab: PROCESS_CONFIG_HISTORY },
};

const createEnumFilterParams = () => ({
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

const textFilterContext = (sortParams: SortParams, filterParams: FilterParams) => ({
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

type NotFilterableColumnArgs = {
    intl: IntlShape;
    getEnumLabel: (value: string) => string;
    isSortableAndFilterable?: false;
};

type FilterableColumnArgs = {
    intl: IntlShape;
    filterEnums: FilterEnumsType;
    getEnumLabel: (value: string) => string;
    isSortableAndFilterable: true;
};

type ColumnsArgs = FilterableColumnArgs | NotFilterableColumnArgs;

const typeColumn = (columnsArgs: ColumnsArgs): ColDef => {
    const { intl, isSortableAndFilterable, getEnumLabel } = columnsArgs;
    return makeAgGridCustomHeaderColumn<CustomAggridAutocompleteFilterParams>({
        headerName: intl.formatMessage({ id: 'AnalysisType' }),
        colId: 'processType',
        field: 'processType',
        pinned: true,
        minWidth: 210,
        ...(isSortableAndFilterable && {
            filterParams: createEnumFilterParams(),
            context: {
                filterComponent: CustomAggridAutocompleteFilter,
                filterComponentParams: {
                    filterParams: { dataType: FilterDataTypes.TEXT, ...sortAndFilterParams.filterParams },
                    options: columnsArgs.filterEnums.processType ?? [],
                    getOptionLabel: getEnumLabel,
                },
            },
        }),
        valueGetter: (p) => p.data.processType,
        valueFormatter: (p: ValueFormatterParams) => getEnumLabel(p.data.processType),
    });
};

const nameColumn = ({ intl, isSortableAndFilterable = false }: ColumnsArgs): ColDef => {
    return makeAgGridCustomHeaderColumn({
        headerName: intl.formatMessage({ id: 'Name' }),
        colId: 'processConfigName',
        field: 'processConfigName',
        minWidth: 300,
        ...(isSortableAndFilterable && {
            context: textFilterContext(sortAndFilterParams.sortParams, sortAndFilterParams.filterParams),
        }),
        valueGetter: (p) => p.data.processConfigName,
    });
};

const sinceColumn = ({ intl, isSortableAndFilterable = false }: ColumnsArgs): ColDef => {
    return makeAgGridCustomHeaderColumn({
        headerName: intl.formatMessage({ id: 'Since' }),
        colId: 'processConfigChangedAt',
        field: 'changedAt',
        minWidth: 180,
        cellRenderer: ConfigDateCellRenderer,
        ...(isSortableAndFilterable && { context: { sortParams: sortAndFilterParams.sortParams } }),
        valueGetter: (p) => p.data.changedAt,
    });
};

const modifiedByColumn = ({ intl, isSortableAndFilterable = false }: ColumnsArgs): ColDef => {
    return makeAgGridCustomHeaderColumn({
        headerName: intl.formatMessage({ id: 'ModifiedBy' }),
        colId: 'processConfigChangedBy',
        field: 'changedBy',
        minWidth: 170,
        cellRenderer: ConfigUserCellRenderer,
        cellRendererParams: { backgroundColor: 'text.secondary' },
        ...(isSortableAndFilterable && {
            context: textFilterContext(sortAndFilterParams.sortParams, sortAndFilterParams.filterParams),
        }),
        valueGetter: (p) => p.data.changedBy,
    });
};

const modifyColumn = (onModify: (config: AutomaticProcessConfigInfos) => void): ColDef => ({
    colId: 'modify',
    headerName: '',
    minWidth: 130,
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
    getEnumLabel: (value: string) => string,
    onModify: (config: AutomaticProcessConfigInfos) => void
): ColDef[] => {
    const args = { intl, getEnumLabel };
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
    getEnumLabel: (value: string) => string
): ColDef[] => {
    const args = { intl, filterEnums, getEnumLabel, isSortableAndFilterable: true };
    return [typeColumn(args), nameColumn(args), sinceColumn(args), modifiedByColumn(args), fullWidthColumn()];
};

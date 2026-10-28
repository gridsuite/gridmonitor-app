/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { PropsWithChildren, useCallback, useMemo } from 'react';
import {
    CustomAggridFilterContext,
    type CustomAggridFilterContextValue,
    CustomAggridSortContext,
    type CustomAggridSortContextValue,
    FilterConfig,
    FilterParams,
    SortConfig,
    SortParams,
    TableColumnFilter,
    TableSort,
} from '@gridsuite/commons-ui';
import type { TableFiltersUpdate, TableSortUpdate } from '../../types/table-state';

type AgGridTableProviderProps = PropsWithChildren<{
    tableSort: TableSort;
    columnFilters: TableColumnFilter;
    onSortChange: (update: TableSortUpdate) => void;
    onFiltersChange: (update: TableFiltersUpdate) => void;
}>;

export function AgGridTableProvider({
    tableSort,
    columnFilters,
    onSortChange,
    onFiltersChange,
    children,
}: Readonly<AgGridTableProviderProps>) {
    const getSortConfig = useCallback(
        (sortParams: SortParams | undefined): SortConfig[] | undefined => {
            if (!sortParams) {
                return undefined;
            }
            return tableSort[sortParams.table]?.[sortParams.tab] ?? [];
        },
        [tableSort]
    );

    const setSortConfig = useCallback(
        (sortParams: SortParams, updatedSortConfig: SortConfig[]) => {
            onSortChange({
                table: sortParams.table,
                tab: sortParams.tab,
                sorts: updatedSortConfig,
            });
        },
        [onSortChange]
    );

    const sortContextValue: CustomAggridSortContextValue = useMemo(
        () => ({ getSortConfig, setSortConfig }),
        [getSortConfig, setSortConfig]
    );

    const getFilters = useCallback(
        ({ type, tab }: Pick<FilterParams, 'type' | 'tab'>): FilterConfig[] => {
            return columnFilters[type]?.[tab] ?? [];
        },
        [columnFilters]
    );

    const updateFilter = useCallback(
        (_colId: string, filterParams: FilterParams, updatedFilters: FilterConfig[]) => {
            const { type, tab } = filterParams;

            onFiltersChange({
                filterType: type,
                filterSubType: tab,
                filters: updatedFilters,
            });
        },
        [onFiltersChange]
    );

    const filterContextValue: CustomAggridFilterContextValue = useMemo(
        () => ({ getFilters, updateFilter }),
        [getFilters, updateFilter]
    );

    return (
        <CustomAggridSortContext.Provider value={sortContextValue}>
            <CustomAggridFilterContext.Provider value={filterContextValue}>
                {children}
            </CustomAggridFilterContext.Provider>
        </CustomAggridSortContext.Provider>
    );
}

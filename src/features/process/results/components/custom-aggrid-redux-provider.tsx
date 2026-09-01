/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { PropsWithChildren, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    CustomAggridFilterContext,
    type CustomAggridFilterContextValue,
    CustomAggridSortContext,
    type CustomAggridSortContextValue,
    FilterConfig,
    FilterParams,
    SortConfig,
    SortParams,
    TableType,
} from '@gridsuite/commons-ui';
import { setTableSort, updateColumnFiltersAction } from '../../../../app/store/actions';

function CustomAggridSortReduxProvider({ children }: PropsWithChildren) {
    const dispatch = useDispatch();
    const tableSort = useSelector((state: any) => {
        return state.appState.tableSort;
    });

    const getSortConfig = useCallback(
        (sortParams: SortParams | undefined): SortConfig[] | undefined => {
            if (!sortParams) {
                return undefined;
            }
            return tableSort[sortParams.table]?.[sortParams.tab];
        },
        [tableSort]
    );

    const setSortConfig = useCallback(
        (sortParams: SortParams, updatedSortConfig: SortConfig[]) => {
            dispatch(setTableSort(sortParams.table, sortParams.tab, updatedSortConfig));
        },
        [dispatch]
    );

    const value: CustomAggridSortContextValue = useMemo(
        () => ({ getSortConfig, setSortConfig }),
        [getSortConfig, setSortConfig]
    );

    return <CustomAggridSortContext.Provider value={value}>{children}</CustomAggridSortContext.Provider>;
}

function CustomAggridFilterReduxProvider({ children }: PropsWithChildren) {
    const dispatch = useDispatch();
    const tableFilters = useSelector((state: any) => state.appState.tableFilters);

    const getFilters = useCallback(
        ({ type, tab }: Pick<FilterParams, 'type' | 'tab'>): FilterConfig[] => {
            return tableFilters.columnsFilters?.[type]?.[tab] ?? [];
        },
        [tableFilters]
    );

    const updateFilter = useCallback(
        (
            colId: string,
            filterParams: FilterParams,
            updatedFilters: FilterConfig[],
            colFilter: FilterConfig | undefined
        ) => {
            const { type, tab } = filterParams;

            if (type === TableType.ProcessLaunchHistory) {
                dispatch(updateColumnFiltersAction(TableType.ProcessLaunchHistory, tab, updatedFilters));
            }
        },
        [dispatch]
    );

    const value: CustomAggridFilterContextValue = useMemo(
        () => ({ getFilters, updateFilter }),
        [getFilters, updateFilter]
    );

    return <CustomAggridFilterContext.Provider value={value}>{children}</CustomAggridFilterContext.Provider>;
}

export function CustomAggridReduxProvider({ children }: PropsWithChildren) {
    return (
        <CustomAggridSortReduxProvider>
            <CustomAggridFilterReduxProvider>{children}</CustomAggridFilterReduxProvider>
        </CustomAggridSortReduxProvider>
    );
}

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { PropsWithChildren, useCallback, useMemo } from 'react';
import type { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import {
    CustomAggridFilterContext,
    type CustomAggridFilterContextValue,
    CustomAggridSortContext,
    type CustomAggridSortContextValue,
    FilterConfig,
    FilterParams,
    SortConfig,
    SortParams,
} from '@gridsuite/commons-ui';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store/store';
import type { SetTableFiltersPayload, SetTableSortPayload, TableStateSlice } from './table-state.reducers';

type CreateProviderConfig = {
    selectState: (state: RootState) => TableStateSlice;
    setTableSort: ActionCreatorWithPayload<SetTableSortPayload>;
    setTableFilters: ActionCreatorWithPayload<SetTableFiltersPayload>;
};

export function createCustomAggridReduxProvider({
    selectState,
    setTableSort,
    setTableFilters,
}: Readonly<CreateProviderConfig>) {
    function SortProvider({ children }: Readonly<PropsWithChildren>) {
        const dispatch = useDispatch<AppDispatch>();
        const tableSort = useSelector((state: RootState) => selectState(state).tableSort);

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
                dispatch(
                    setTableSort({
                        table: sortParams.table,
                        tab: sortParams.tab,
                        sorts: updatedSortConfig,
                    })
                );
            },
            [dispatch]
        );

        const value: CustomAggridSortContextValue = useMemo(
            () => ({ getSortConfig, setSortConfig }),
            [getSortConfig, setSortConfig]
        );

        return <CustomAggridSortContext.Provider value={value}>{children}</CustomAggridSortContext.Provider>;
    }

    function FilterProvider({ children }: Readonly<PropsWithChildren>) {
        const dispatch = useDispatch<AppDispatch>();
        const tableFilters = useSelector((state: RootState) => selectState(state).tableFilters);

        const getFilters = useCallback(
            ({ type, tab }: Pick<FilterParams, 'type' | 'tab'>): FilterConfig[] => {
                return tableFilters?.[type]?.[tab] ?? [];
            },
            [tableFilters]
        );

        const updateFilter = useCallback(
            (_colId: string, filterParams: FilterParams, updatedFilters: FilterConfig[]) => {
                const { type, tab } = filterParams;

                dispatch(
                    setTableFilters({
                        filterType: type,
                        filterSubType: tab,
                        filters: updatedFilters,
                    })
                );
            },
            [dispatch]
        );

        const value: CustomAggridFilterContextValue = useMemo(
            () => ({ getFilters, updateFilter }),
            [getFilters, updateFilter]
        );

        return <CustomAggridFilterContext.Provider value={value}>{children}</CustomAggridFilterContext.Provider>;
    }

    return function CustomAggridReduxProvider({ children }: Readonly<PropsWithChildren>) {
        return (
            <SortProvider>
                <FilterProvider>{children}</FilterProvider>
            </SortProvider>
        );
    };
}

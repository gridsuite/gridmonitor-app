/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PropsWithChildren, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { AgGridTableProvider } from 'shared/ui/ag-grid/AgGridTableProvider';
import type { TableFiltersUpdate, TableSortUpdate } from 'shared/types/table-state';
import { setTableFilters, setTableSort } from '../store/process-execution-list.slice';

export function ExecutionListTableProvider({ children }: Readonly<PropsWithChildren>) {
    const dispatch = useAppDispatch();
    const { tableSort, tableFilters } = useAppSelector((state) => state.processExecutionList);
    const updateSort = useCallback(
        (update: TableSortUpdate) => {
            dispatch(setTableSort(update));
        },
        [dispatch]
    );
    const updateFilters = useCallback(
        (update: TableFiltersUpdate) => {
            dispatch(setTableFilters(update));
        },
        [dispatch]
    );

    return (
        <AgGridTableProvider
            tableSort={tableSort}
            columnFilters={tableFilters.columnsFilters}
            onSortChange={updateSort}
            onFiltersChange={updateFilters}
        >
            {children}
        </AgGridTableProvider>
    );
}

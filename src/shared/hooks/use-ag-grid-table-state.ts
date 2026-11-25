/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { RefObject, useCallback, useEffect } from 'react';
import { TableType, updateAgGridFilters } from '@gridsuite/commons-ui';
import { AgGridReact } from 'ag-grid-react';
import { ColumnState, GridApi } from 'ag-grid-community';

type UseAgGridTableStateArgs = {
    gridRef: RefObject<AgGridReact | null>;
    tableSort: Record<string, Record<string, ColumnState[]> | undefined>;
    tableFilters: { columnsFilters?: Record<string, Record<string, any> | undefined> };
    sortStore: string;
    tab: string;
};

export function useAgGridTableState({ gridRef, tableSort, tableFilters, sortStore, tab }: UseAgGridTableStateArgs) {
    const sortState = tableSort[sortStore]?.[tab];
    const filters = tableFilters.columnsFilters?.[TableType.ProcessExecutionList]?.[tab];

    const onGridReady = useCallback(
        ({ api }: { api: GridApi }) => {
            api.applyColumnState({ state: sortState ?? [], defaultState: { sort: null } });
            updateAgGridFilters(api, filters);
        },
        [sortState, filters]
    );

    useEffect(() => {
        gridRef.current?.api?.applyColumnState({ state: sortState ?? [], defaultState: { sort: null } });
    }, [gridRef, sortState]);

    useEffect(() => {
        updateAgGridFilters(gridRef.current?.api, filters);
    }, [gridRef, filters]);

    return { onGridReady };
}

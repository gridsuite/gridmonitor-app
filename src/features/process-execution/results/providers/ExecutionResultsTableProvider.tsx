/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PropsWithChildren, useMemo } from 'react';
import { bindActionCreators } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { AgGridTableProvider } from 'shared/ui/ag-grid/AgGridTableProvider';
import { executionResultsTableActions } from '../store/execution-results.slice';

export function ExecutionResultsTableProvider({ children }: Readonly<PropsWithChildren>) {
    const dispatch = useAppDispatch();
    const tableState = useAppSelector((state) => state.executionResults);
    const actions = useMemo(() => bindActionCreators(executionResultsTableActions, dispatch), [dispatch]);

    return (
        <AgGridTableProvider {...tableState} {...actions}>
            {children}
        </AgGridTableProvider>
    );
}

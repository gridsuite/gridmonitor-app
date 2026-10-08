/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PropsWithChildren, useMemo, useState } from 'react';
import {
    ReportFetcherContext,
    ReportFilterContext,
    ReportFilterContextValue,
    NotificationsUrlKeys,
    useNotificationsListener,
} from '@gridsuite/commons-ui';
import { CustomAggridReduxProvider } from '../list/custom-aggrid-redux-provider';
import { useReportViewerProvider } from './hooks/use-report-viewer-provider';

type ProcessReportViewerProviderProps = PropsWithChildren<{
    executionId: string;
}>;

export function ProcessReportViewerProvider({ executionId, children }: Readonly<ProcessReportViewerProviderProps>) {
    const [refreshCounter, setRefreshCounter] = useState(0);

    useNotificationsListener(NotificationsUrlKeys.MONITOR, {
        listenerCallbackMessage: (event: MessageEvent) => {
            const eventData = JSON.parse(event.data);
            if (
                executionId &&
                eventData.headers?.processExecutionId === executionId &&
                eventData.headers?.updateType === 'PROCESS_EXECUTION_UPDATED'
            ) {
                setRefreshCounter((prev) => prev + 1);
            }
        },
    });

    const { fetchLogs, fetchLogMatches, filters, updateFilters, pagination, changePagination } =
        useReportViewerProvider(executionId);

    const fetcherContextValue = useMemo(
        () => ({ fetchLogs, fetchLogMatches, refreshCounter }),
        [fetchLogs, fetchLogMatches, refreshCounter]
    );

    const filterContextValue = useMemo<ReportFilterContextValue>(
        () => ({ filters, updateFilters, pagination, changePagination }),
        [filters, updateFilters, pagination, changePagination]
    );

    return (
        <CustomAggridReduxProvider>
            <ReportFetcherContext.Provider value={fetcherContextValue}>
                <ReportFilterContext.Provider value={filterContextValue}>{children}</ReportFilterContext.Provider>
            </ReportFetcherContext.Provider>
        </CustomAggridReduxProvider>
    );
}

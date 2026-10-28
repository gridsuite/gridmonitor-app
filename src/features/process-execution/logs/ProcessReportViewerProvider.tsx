/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import {
    NotificationsUrlKeys,
    ReportFetcherContext,
    ReportFilterContext,
    ReportFilterContextValue,
    useNotificationsListener,
} from '@gridsuite/commons-ui';
import { isProcessExecutionUpdateNotification } from 'shared/api/monitor-api';
import { CustomAggridReduxProvider } from '../history/custom-aggrid-redux-provider';
import { useReportViewerProvider } from './hooks/use-report-viewer-provider';

type ProcessReportViewerProviderProps = PropsWithChildren<{
    executionId: string;
}>;

export function ProcessReportViewerProvider({ executionId, children }: Readonly<ProcessReportViewerProviderProps>) {
    const [refreshCounter, setRefreshCounter] = useState(0);

    const invalidateRefreshCounter = useCallback(
        (event: MessageEvent) => {
            const eventData = JSON.parse(event.data);
            if (
                executionId &&
                isProcessExecutionUpdateNotification(eventData) &&
                eventData.headers.processExecutionId === executionId
            ) {
                setRefreshCounter((prev) => prev + 1);
            }
        },
        [executionId]
    );

    useNotificationsListener(NotificationsUrlKeys.MONITOR, {
        listenerCallbackMessage: invalidateRefreshCounter,
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

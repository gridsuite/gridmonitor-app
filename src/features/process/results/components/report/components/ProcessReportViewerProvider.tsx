/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PropsWithChildren, useMemo } from 'react';
import { ReportFetcherContext, ReportFilterContext, ReportFilterContextValue } from '@gridsuite/commons-ui';
import { CustomAggridReduxProvider } from '../../common/custom-aggrid/custom-aggrid-redux-provider';
import { useReportViewerProvider } from '../hooks/use-report-viewer-provider';

type ProcessReportViewerProviderProps = PropsWithChildren<{
    executionId: string;
}>;

export function ProcessReportViewerProvider({ executionId, children }: Readonly<ProcessReportViewerProviderProps>) {
    const { fetchLogs, fetchLogMatches, filters, updateFilters, pagination, changePagination, refreshCounter } =
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

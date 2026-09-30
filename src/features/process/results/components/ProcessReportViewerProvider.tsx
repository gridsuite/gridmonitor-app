/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import {
    FilterConfig,
    MatchPosition,
    PaginationConfig,
    PagedLogs,
    ReportFetcherContext,
    ReportFetcherContextValue,
    ReportFilterContext,
    ReportFilterContextValue,
    SeverityLevel,
    Log,
    REPORT_SEVERITY,
    TableType,
    NotificationsUrlKeys,
    useNotificationsListener,
    PROCESS_EXECUTION,
} from '@gridsuite/commons-ui';
import { useLazyGetExecutionLogsQuery, useLazyGetExecutionLogsSearchQuery } from 'shared/api/monitor-api';
import { useAppDispatch, useAppSelector } from 'app/store/store';
import { useParams } from 'react-router';
import { setTableFilters } from '../store/process-results.slice';
import { CustomAggridReduxProvider } from './custom-aggrid-redux-provider';

const DEFAULT_PAGE_SIZE = 15;

export type RawReportLog = {
    message?: string;
    severity?: SeverityLevel | string;
    depth?: number;
    parentId?: string;
};

export const mapReportLogs = (reportLogs: RawReportLog[] = []): Log[] => {
    if (!reportLogs.length) {
        return [];
    }
    const minDepth = reportLogs.reduce((min, log) => Math.min(min, log.depth ?? 0), reportLogs[0].depth ?? 0);
    return reportLogs.map((reportLog) => {
        const severity =
            Object.values(REPORT_SEVERITY).find((s) => reportLog.severity === s.name) ?? REPORT_SEVERITY.UNKNOWN;
        return {
            message: reportLog.message ?? '',
            severity: severity.name,
            backgroundColor: severity.colorName,
            depth: (reportLog.depth ?? 0) - minDepth,
            parentId: reportLog.parentId ?? '',
        };
    });
};

export function ProcessReportViewerProvider({ children }: Readonly<PropsWithChildren>) {
    const { id: executionId } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const filters = useAppSelector(
        (state) => state.processResults.tableFilters.columnsFilters?.[TableType.Logs]?.[PROCESS_EXECUTION] ?? []
    );

    const [pagination, setPagination] = useState<PaginationConfig>({ page: 0, rowsPerPage: DEFAULT_PAGE_SIZE });
    const [refreshCounter, setRefreshCounter] = useState(0);

    const [triggerLogs] = useLazyGetExecutionLogsQuery();
    const [triggerLogsSearch] = useLazyGetExecutionLogsSearchQuery();

    useNotificationsListener(NotificationsUrlKeys.MONITOR, {
        listenerCallbackMessage: (event: MessageEvent) => {
            const eventData = JSON.parse(event.data);
            if (
                (eventData.headers?.updateType === 'PROCESS_STEP_UPDATED' ||
                    eventData.headers?.updateType === 'PROCESS_STEPS_UPDATED') &&
                eventData.headers?.processExecutionId === executionId
            ) {
                setRefreshCounter((prev) => prev + 1);
            }
        },
    });

    const fetchLogs = useCallback<ReportFetcherContextValue['fetchLogs']>(
        async (reportId, severityList, messageFilter, _reportType, page, size): Promise<PagedLogs> => {
            const reportPage = await triggerLogs({
                executionId: executionId ?? '',
                reportId,
                messageFilter: messageFilter || undefined,
                severityLevelsFilter: severityList.length > 0 ? severityList : undefined,
                page,
                size,
            }).unwrap();
            return {
                content: mapReportLogs(reportPage.content ?? []),
                totalElements: reportPage.totalElements ?? 0,
                totalPages: reportPage.totalPages ?? 0,
            };
        },
        [executionId, triggerLogs]
    );

    const fetchLogMatches = useCallback<ReportFetcherContextValue['fetchLogMatches']>(
        async (reportId, severityList, messageFilter, _reportType, searchTerm, pageSize): Promise<MatchPosition[]> => {
            const matches = await triggerLogsSearch({
                executionId: executionId ?? '',
                reportId,
                messageFilter: messageFilter || undefined,
                severityLevelsFilter: severityList.length > 0 ? severityList : undefined,
                searchTerm,
                pageSize,
            }).unwrap();
            return matches.map(({ page, rowIndex }) => ({
                page: page ?? 0,
                rowIndex: rowIndex ?? 0,
            }));
        },
        [executionId, triggerLogsSearch]
    );

    const updateFilters = useCallback(
        (newFilters: FilterConfig[]) => {
            dispatch(
                setTableFilters({
                    filterType: TableType.Logs,
                    filterSubType: PROCESS_EXECUTION,
                    filters: newFilters,
                })
            );
        },
        [dispatch]
    );

    const changePagination = useCallback(
        (config: PaginationConfig) =>
            setPagination({
                page: config.page,
                rowsPerPage: typeof config.rowsPerPage === 'number' ? config.rowsPerPage : config.rowsPerPage.value,
            }),
        []
    );

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

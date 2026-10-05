/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useCallback, useState } from 'react';
import {
    FilterConfig,
    Log,
    MatchPosition,
    PagedLogs,
    PaginationConfig,
    PROCESS_EXECUTION,
    REPORT_SEVERITY,
    ReportFetcherContextValue,
    SeverityLevel,
    TableType,
} from '@gridsuite/commons-ui';
import { useAppDispatch, useAppSelector } from 'app/store/store';
import { useLazyGetExecutionLogsQuery, useLazyGetExecutionLogsSearchQuery } from 'shared/api/monitor-api';
import { setTableFilters } from '../../../store/process-results.slice';
import { useProcessLogsInvalidation } from './use-process-logs-invalidation';

const DEFAULT_PAGE_SIZE = 30;

export type RawReportLog = {
    message?: string;
    severity?: SeverityLevel;
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

export function useReportViewerProvider(executionId?: string) {
    const dispatch = useAppDispatch();
    const filters = useAppSelector(
        (state) => state.processResults.tableFilters.columnsFilters?.[TableType.Logs]?.[PROCESS_EXECUTION] ?? []
    );

    const [pagination, setPagination] = useState<PaginationConfig>({ page: 0, rowsPerPage: DEFAULT_PAGE_SIZE });

    const [triggerLogs] = useLazyGetExecutionLogsQuery();
    const [triggerLogsSearch] = useLazyGetExecutionLogsSearchQuery();

    const fetchLogs = useCallback<ReportFetcherContextValue['fetchLogs']>(
        async (reportId, severityList, messageFilter, _reportType, page, size): Promise<PagedLogs> => {
            if (!executionId) {
                return {
                    content: [],
                    totalElements: 0,
                    totalPages: 0,
                };
            }

            const reportPage = await triggerLogs({
                executionId,
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
            if (!executionId) {
                return [];
            }

            const matches = await triggerLogsSearch({
                executionId,
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

    const [refreshCounter, setRefreshCounter] = useState(0);
    const handleInvalidate = useCallback(() => {
        setRefreshCounter((prev) => prev + 1);
    }, []);
    useProcessLogsInvalidation({ executionId, onInvalidate: handleInvalidate });

    return { fetchLogs, fetchLogMatches, filters, updateFilters, pagination, changePagination, refreshCounter };
}

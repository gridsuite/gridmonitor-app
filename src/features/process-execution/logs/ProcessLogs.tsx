/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { PROCESS_EXECUTION, ReportViewer } from '@gridsuite/commons-ui';
import { FormattedMessage } from 'react-intl';
import { Box, Breadcrumbs, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { ProcessReportViewerProvider } from './ProcessReportViewerProvider';
import { useProcessLogs } from './hooks/use-process-logs';
import { APP_PATHS } from '../../../app/router/paths';
import { ExecutionStatus } from '../../../shared/ui/ExecutionStatus';
import { ProcessLogsAlert } from './ProcessLogsAlert';

export function ProcessLogs({ executionId = '' }: Readonly<{ executionId?: string }>) {
    const { execution, report, severities, isError, isEmpty, isLoading } = useProcessLogs(executionId);

    if (!execution) {
        return (
            <ProcessLogsAlert
                isEmpty={isEmpty}
                isError={isError}
                isLoading={isLoading}
                isMissingExecutionId={!executionId}
            />
        );
    }

    return (
        <Stack sx={{ p: 3, height: '100%' }}>
            <Breadcrumbs separator="/">
                <Link component={RouterLink} to={APP_PATHS.process.results} underline="hover">
                    <Typography variant="subtitle1">
                        <FormattedMessage id="processLaunchHistory" />
                    </Typography>
                </Link>

                <Link component={RouterLink} to={APP_PATHS.process.stepInfos(executionId)} underline="hover">
                    <Typography variant="subtitle1">
                        <FormattedMessage id={execution.type} />
                    </Typography>
                </Link>

                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    <FormattedMessage id="Logs" />
                </Typography>
            </Breadcrumbs>

            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 1 }}>
                <Typography variant="h6" noWrap>
                    <FormattedMessage id="Logs" />
                </Typography>
                <ExecutionStatus value={execution.status} />
            </Stack>

            {report && (
                <Box sx={{ flex: 1, minHeight: 0, mt: 3 }}>
                    <ProcessReportViewerProvider executionId={executionId}>
                        <ReportViewer report={report} reportType={PROCESS_EXECUTION} severities={severities} />
                    </ProcessReportViewerProvider>
                </Box>
            )}
        </Stack>
    );
}

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { PROCESS_EXECUTION, ReportViewer } from '@gridsuite/commons-ui';
import { FormattedMessage } from 'react-intl';
import { Box, Breadcrumbs, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router';
import { ProcessReportViewerProvider } from '../components/report/components/ProcessReportViewerProvider';
import { useProcessLogs } from '../components/report/hooks/use-process-logs';
import { PROCESS_PATHS } from '../../router/process-paths';
import { ExecutionStatus } from '../../../../shared/ui/ExecutionStatus';
import { ProcessLogsAlert } from '../components/report/components/ProcessLogsAlert';

function ProcessLogsPage() {
    const { id: executionId = '' } = useParams<{ id: string }>();
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
        <Stack spacing={3} sx={{ p: 3, height: '100%' }}>
            <Breadcrumbs separator="/">
                <Link component={RouterLink} to={PROCESS_PATHS.results} underline="hover">
                    <Typography variant="subtitle1">
                        <FormattedMessage id="processLaunchHistory" />
                    </Typography>
                </Link>

                <Link component={RouterLink} to={PROCESS_PATHS.stepInfos(executionId)} underline="hover">
                    <Typography variant="subtitle1">
                        <FormattedMessage id={execution.type} />
                    </Typography>
                </Link>

                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    <FormattedMessage id="Logs" />
                </Typography>
            </Breadcrumbs>

            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Typography variant="h6" noWrap>
                    <FormattedMessage id="Logs" />
                </Typography>
                <ExecutionStatus value={execution.status} />
            </Stack>

            <Box sx={{ flex: 1, minHeight: 0 }}>
                <ProcessReportViewerProvider executionId={executionId}>
                    {report && <ReportViewer report={report} reportType={PROCESS_EXECUTION} severities={severities} />}
                </ProcessReportViewerProvider>
            </Box>
        </Stack>
    );
}

export default ProcessLogsPage;

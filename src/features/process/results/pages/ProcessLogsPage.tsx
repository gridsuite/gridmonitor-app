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
import { ProcessReportViewerProvider } from '../components/ProcessReportViewerProvider';
import { useProcessLogs } from '../hooks/use-process-logs';
import { PROCESS_PATHS } from '../../router/process-paths';
import { ExecutionStatus } from '../../../../shared/ui/ExecutionStatus';

function ProcessLogsPage() {
    const { execution, report, severities } = useProcessLogs();

    return (
        <>
            {execution && (
                <Box
                    sx={{
                        p: 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Stack
                        spacing={3}
                        sx={{
                            height: '100%',
                        }}
                    >
                        <Breadcrumbs separator="/">
                            <Link component={RouterLink} to={PROCESS_PATHS.results} underline="hover">
                                <Typography variant="subtitle1">
                                    <FormattedMessage id="processLaunchHistory" />
                                </Typography>
                            </Link>

                            <Link component={RouterLink} to={PROCESS_PATHS.stepInfos(execution.id)} underline="hover">
                                <Typography variant="subtitle1">
                                    <FormattedMessage id={execution.type} />
                                </Typography>
                            </Link>

                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                <FormattedMessage id="Logs" />
                            </Typography>
                        </Breadcrumbs>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: 1,
                                width: '100%',
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    minWidth: 0,
                                    flex: '1 1 240px',
                                }}
                            >
                                <Typography variant="h6" noWrap>
                                    <FormattedMessage id="Logs" />
                                </Typography>

                                <ExecutionStatus value={execution.status} />
                            </Stack>
                        </Box>
                        {report && (
                            <Box sx={{ flex: 1, minHeight: 0 }}>
                                <ProcessReportViewerProvider>
                                    <ReportViewer
                                        report={report}
                                        reportType={PROCESS_EXECUTION}
                                        severities={severities}
                                    />
                                </ProcessReportViewerProvider>
                            </Box>
                        )}
                    </Stack>
                </Box>
            )}
        </>
    );
}

export default ProcessLogsPage;

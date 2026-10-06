/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Breadcrumbs,
    Button,
    Grid,
    Link,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';

import { ExpandMore, RotateRightOutlined } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link as RouterLink } from 'react-router';
import { ExecutionStatus } from 'shared/ui/ExecutionStatus';
import { ProcessStatus, type ProcessExecution } from 'shared/api/monitor-api';
import { useGetElementsNameQuery } from 'shared/api/explore-api';
import { getFormattedDate } from 'shared/lib/date-time-formatter';
import { PROCESS_PATHS } from 'features/process/router/process-paths';
import ResponsiveStepper from './ResponsiveStepper';
import { ProcessStepModel } from '../models/process-result';
import { InfoItem, InfoItemType } from './InfoItem';

type ProcessExecutionDetailsProps = {
    execution: ProcessExecution;
    steps: ProcessStepModel[];
};

export default function ProcessExecutionDetails({ execution, steps }: Readonly<ProcessExecutionDetailsProps>) {
    const executionCompleted = execution.status === ProcessStatus.Completed;
    const [isOpen, setIsOpen] = useState(!executionCompleted);

    const { currentData: names = {} } = useGetElementsNameQuery({
        ids: [execution.processConfigId, execution.caseUuid],
    });

    const intl = useIntl();

    const theme = useTheme();

    const caseName = names[execution.caseUuid];
    const processConfigName = names[execution.processConfigId];

    const boxBackground = theme.palette.mode === 'dark' ? grey[900] : grey[100];

    const handleAccordionChange = (_event: React.SyntheticEvent, expanded: boolean) => {
        setIsOpen(expanded);
    };

    return (
        <Box
            sx={{
                p: 3,
            }}
        >
            <Stack spacing={3}>
                <Breadcrumbs separator="/">
                    <Link component={RouterLink} to={PROCESS_PATHS.results} underline="hover">
                        <Typography variant="subtitle1">
                            <FormattedMessage id="processLaunchHistory" />
                        </Typography>
                    </Link>

                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        <FormattedMessage id={execution.type} />
                    </Typography>
                </Breadcrumbs>
                <Stack
                    direction="row"
                    sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}
                >
                    <Stack direction="row" spacing={1}>
                        <Typography variant="h6" noWrap>
                            <FormattedMessage id={execution.type} />
                        </Typography>

                        {execution.status && <ExecutionStatus value={execution.status} />}
                    </Stack>

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            flex: '0 0 auto',
                        }}
                    >
                        <Button
                            component={RouterLink}
                            to="logs"
                            variant="outlined"
                            disabled={execution.status === ProcessStatus.Scheduled}
                        >
                            <FormattedMessage id="Logs" />
                        </Button>

                        <Button variant="contained" disabled>
                            <FormattedMessage id="compare.agregate" />
                        </Button>
                    </Stack>
                </Stack>
                {!executionCompleted && (
                    <Box sx={{ p: 1, bgcolor: boxBackground }}>
                        <Typography variant="subtitle1" sx={{ px: 1, mb: 2 }}>
                            <FormattedMessage id="analysisProgress" />
                        </Typography>
                        <ResponsiveStepper steps={steps} />
                    </Box>
                )}
                <Accordion
                    expanded={isOpen}
                    elevation={theme.palette.mode === 'dark' ? 0 : 1}
                    onChange={handleAccordionChange}
                    sx={{
                        '&.Mui-expanded': {
                            mb: 0,
                        },
                    }}
                >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography component="span" variant="body1">
                            <FormattedMessage id="processConfigGeneralInformation" />
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ mb: 0 }}>
                        <Grid
                            container
                            columns={{ xs: 6, sm: 12 }}
                            columnSpacing={2}
                            rowSpacing={2}
                            sx={{
                                width: '100%',
                                boxSizing: 'border-box',
                            }}
                        >
                            <InfoItem
                                label="ProcessLaunchedBy"
                                value={execution.userIdentity ?? execution.userId}
                                infoType={InfoItemType.User}
                            />

                            <InfoItem
                                label="ProcessScheduledAt"
                                value={getFormattedDate(intl.locale, execution.scheduledAt).formattedDate}
                            />

                            <InfoItem
                                label="ProcessStartedAt"
                                value={getFormattedDate(intl.locale, execution.startedAt).formattedDate}
                            />

                            <InfoItem
                                label="ProcessCompletedAt"
                                value={getFormattedDate(intl.locale, execution.completedAt).formattedDate}
                            />

                            <InfoItem label="configuration" value={processConfigName} infoType={InfoItemType.Url} />

                            <InfoItem label="case" value={caseName} />
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                <Stack
                    sx={{
                        padding: 5,
                        bgcolor: boxBackground,
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.8,
                    }}
                >
                    <RotateRightOutlined
                        sx={{
                            fontSize: 24,
                        }}
                    />

                    <Typography variant="body1">
                        <FormattedMessage id="resultsNotAvailable" />
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );
}

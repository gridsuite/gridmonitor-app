/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import { StepStatus } from 'shared/api/monitor-api';
import { formatCompletedAt, formatDuration } from 'shared/lib/date-time-formatter';
import { FormattedMessage } from 'react-intl';
import { ProcessStepModel } from '../models/process-result';
import { useElapsedTime } from '../hooks/use-elapsed-time';
import { useStepperOrientation } from '../hooks/use-stepper-orientation';

function StepStatusText({ step }: { readonly step: ProcessStepModel }) {
    const elapsed = useElapsedTime(step.status === StepStatus.Running ? step.startedAt : undefined);
    switch (step.status) {
        case StepStatus.Completed:
        case StepStatus.Failed:
            return <FormattedMessage id="finishedAt" values={{ date: formatCompletedAt(step.completedAt) }} />;

        case StepStatus.Running:
            return <FormattedMessage id="elapsedTime" values={{ date: formatDuration(elapsed) }} />;

        case StepStatus.Scheduled:
            return <FormattedMessage id="pending" />;

        case StepStatus.Skipped:
            return <FormattedMessage id="skipped" />;

        default:
            return '';
    }
}

export default function ResponsiveStepper({ steps }: { readonly steps: ProcessStepModel[] }) {
    const { containerRef, orientation } = useStepperOrientation(steps.length);
    const runningIndex = steps.findIndex((s) => s.status === StepStatus.Running);
    const activeStep = runningIndex === -1 ? steps.length : runningIndex;

    return (
        <Box ref={containerRef} sx={{ width: '100%' }}>
            <Stepper
                activeStep={activeStep}
                orientation={orientation}
                sx={{
                    '& .MuiStep-horizontal': {
                        alignItems: 'flex-start',
                    },
                    '& .MuiStepConnector-horizontal': {
                        marginTop: 1.5,
                    },
                    '& .MuiStep-vertical': {
                        paddingLeft: 1,
                    },
                }}
            >
                {steps.map((step) => (
                    <Step key={step.id} completed={step.status === StepStatus.Completed}>
                        <StepLabel
                            error={step.status === StepStatus.Failed}
                            icon={
                                step.status === StepStatus.Failed ? (
                                    <ErrorIcon
                                        sx={{
                                            transform: 'scale(1.2)',
                                        }}
                                        color="error"
                                    />
                                ) : undefined
                            }
                            sx={{
                                '&.MuiStepLabel-horizontal': {
                                    alignItems: 'flex-start',
                                },
                                '&.MuiStepLabel-vertical': {
                                    alignItems: 'flex-start',
                                    paddingBottom: 0,
                                },
                            }}
                            optional={
                                <Typography variant="caption" color="text.secondary">
                                    <StepStatusText step={step} />
                                </Typography>
                            }
                        >
                            <FormattedMessage id={step.stepType} />
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}

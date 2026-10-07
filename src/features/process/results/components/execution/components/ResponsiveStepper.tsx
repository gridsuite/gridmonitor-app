/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import { FormattedMessage, useIntl } from 'react-intl';
import { StepStatus } from 'shared/api/monitor-api';
import { formatCompletedAt, formatDuration } from 'shared/lib/date-time-formatter';
import { ProcessStepModel } from '../../../models/process-result';
import { useElapsedTime } from '../hooks/use-elapsed-time';
import { useStepperOrientation } from '../hooks/use-stepper-orientation';

function StepStatusText({
    step,
    elapsed,
    locale,
}: Readonly<{
    step: ProcessStepModel;
    elapsed: number;
    locale: string;
}>) {
    switch (step.status) {
        case StepStatus.Completed:
        case StepStatus.Failed:
            return <FormattedMessage id="finishedAt" values={{ date: formatCompletedAt(locale, step.completedAt) }} />;

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

function ProcessStepper({
    steps,
    activeStep,
    orientation,
    elapsed,
}: {
    readonly steps: ProcessStepModel[];
    readonly activeStep: number;
    readonly orientation: 'horizontal' | 'vertical';
    readonly elapsed: number;
}) {
    const intl = useIntl();
    return (
        <Stepper
            activeStep={activeStep}
            orientation={orientation}
            sx={{
                ...(orientation === 'horizontal' && { minWidth: 'max-content' }),
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
                                <StepStatusText step={step} elapsed={elapsed} locale={intl.locale} />
                            </Typography>
                        }
                    >
                        <FormattedMessage id={step.stepType} />
                    </StepLabel>
                </Step>
            ))}
        </Stepper>
    );
}

export default function ResponsiveStepper({ steps }: { readonly steps: ProcessStepModel[] }) {
    const { containerRef, measureRef, orientation } = useStepperOrientation();
    const runningIndex = steps.findIndex((s) => s.status === StepStatus.Running);
    const activeStep = runningIndex === -1 ? steps.length : runningIndex;
    const elapsed = useElapsedTime(steps[runningIndex]?.startedAt);

    return (
        <Box ref={containerRef} sx={{ width: '100%', minWidth: 0, position: 'relative' }}>
            <Box
                aria-hidden="true"
                sx={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', visibility: 'hidden' }}
            >
                <Box ref={measureRef} sx={{ width: 'max-content' }}>
                    <ProcessStepper steps={steps} activeStep={activeStep} orientation="horizontal" elapsed={elapsed} />
                </Box>
            </Box>
            <ProcessStepper steps={steps} activeStep={activeStep} orientation={orientation} elapsed={elapsed} />
        </Box>
    );
}

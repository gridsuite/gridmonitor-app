/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import { Box, Button, Card, CardContent, Chip, Collapse, Divider, Paper, Stack, Typography } from '@mui/material';
import type { ProcessExecutionStep } from 'shared/api/monitor-api';
import { ProcessStepModel } from '../models/process-result';

type StepStatus = NonNullable<ProcessExecutionStep['status']>;

function getStatusColor(status?: StepStatus): 'default' | 'primary' | 'success' | 'error' | 'warning' {
    switch (status) {
        case 'COMPLETED':
            return 'success';
        case 'FAILED':
            return 'error';
        case 'RUNNING':
            return 'warning';
        case 'SCHEDULED':
            return 'primary';
        case 'SKIPPED':
        default:
            return 'default';
    }
}

function FieldRow({ label, value }: Readonly<{ label: string; value?: string | number }>) {
    return (
        <Stack spacing={0.5}>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: 'uppercase', letterSpacing: 0.6 }}
            >
                {label}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: value ? 'monospace' : 'inherit', wordBreak: 'break-word' }}>
                {value ?? 'N/A'}
            </Typography>
        </Stack>
    );
}

type ProcessStepInfosItemProps = {
    index: number;
    step: ProcessStepModel;
};

export function ProcessStepInfosItem({ index, step }: Readonly<ProcessStepInfosItemProps>) {
    const [expanded, setExpanded] = useState(false);

    return (
        <Card variant="outlined">
            <CardContent>
                <Stack spacing={2}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1.5}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                    >
                        <Stack spacing={0.5}>
                            <Typography variant="h6">Step {step.stepOrder ?? index + 1}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {step.stepType}
                            </Typography>
                        </Stack>
                        <Chip label={step.status} color={getStatusColor(step.status)} variant="outlined" size="small" />
                    </Stack>

                    <Divider />

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <Box sx={{ flex: 1 }}>
                            <Stack spacing={2}>
                                <FieldRow label="Step Order" value={step.stepOrder} />
                                <FieldRow label="Step Type" value={step.stepType} />
                                <FieldRow label="Step ID" value={step.id} />
                            </Stack>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Stack spacing={2}>
                                <FieldRow label="Started At" value={step.startedAt?.toLocaleString()} />
                                <FieldRow label="Completed At" value={step.completedAt?.toLocaleString()} />
                                <FieldRow label="Result Type" value={step.resultType} />
                            </Stack>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Stack spacing={2}>
                                <FieldRow label="Result ID" value={step.resultId} />
                                <FieldRow label="Report ID" value={step.reportId} />
                            </Stack>
                        </Box>
                    </Stack>

                    <Stack direction="row" justifyContent="flex-end">
                        <Button size="small" onClick={() => setExpanded((previous) => !previous)}>
                            {expanded ? 'Hide raw data' : 'Show raw data'}
                        </Button>
                    </Stack>

                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                overflowX: 'auto',
                            }}
                        >
                            <Typography
                                sx={{
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {JSON.stringify(step, null, 4)}
                            </Typography>
                        </Paper>
                    </Collapse>
                </Stack>
            </CardContent>
        </Card>
    );
}

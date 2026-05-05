/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Stack, Typography } from '@mui/material';
import { ProcessStepInfosItem } from './ProcessStepInfosItem';
import { ProcessStepModel } from '../models/process-result';

type ProcessStepInfosProps = {
    executionId: string;
    steps: ProcessStepModel[];
};

export function ProcessStepInfosView({ executionId, steps }: Readonly<ProcessStepInfosProps>) {
    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h5" gutterBottom>
                    Process Step Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {steps.length} step{steps.length === 1 ? '' : 's'} for execution {executionId}.
                </Typography>
            </Box>

            <Box
                sx={{
                    maxHeight: '75vh',
                    overflowY: 'auto',
                    pr: { xs: 0, sm: 1 },
                }}
            >
                <Stack spacing={2}>
                    {steps.map((step, index) => (
                        <ProcessStepInfosItem
                            key={step.id ?? `${step.stepOrder ?? 'step'}-${index}`}
                            index={index}
                            step={step}
                        />
                    ))}
                </Stack>
            </Box>
        </Stack>
    );
}

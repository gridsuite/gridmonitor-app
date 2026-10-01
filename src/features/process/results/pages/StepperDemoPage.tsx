/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Slider, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { StepStatus } from 'shared/api/monitor-api';
import ResponsiveStepper from '../components/ResponsiveStepper';
import type { ProcessStepModel } from '../models/process-result';

const STEP_TYPES = [
    'LOAD_NETWORK',
    'APPLY_MODIFICATIONS',
    'RUN_LF_COMPUTATION',
    'RUN_SA_COMPUTATION',
    'RUN_SC_COMPUTATION',
];

function demoSteps(count: number): ProcessStepModel[] {
    return Array.from({ length: count }, (_, index) => {
        let status = StepStatus.Scheduled;
        if (index === Math.floor(count / 2)) {
            status = StepStatus.Running;
        } else if (index === 1 && count > 3) {
            status = StepStatus.Failed;
        } else if (index < count / 2) {
            status = StepStatus.Completed;
        }

        return {
            id: `demo-${count}-${index}`,
            stepOrder: index,
            stepType: STEP_TYPES[index % STEP_TYPES.length],
            status,
            startedAt: new Date(),
            completedAt: index < count / 2 ? new Date() : undefined,
        };
    });
}

const THREE_STEPS = demoSteps(3);
const SIX_STEPS = demoSteps(6);
const TEN_STEPS = demoSteps(10);

export default function StepperDemoPage() {
    const [width, setWidth] = useState(800);

    return (
        <Stack spacing={3} sx={{ p: 3 }}>
            <Typography variant="h5">Responsive stepper demo</Typography>
            <Box sx={{ maxWidth: 400 }}>
                <Typography gutterBottom>Container width: {width}px (limited by the viewport)</Typography>
                <Slider
                    aria-label="Container width"
                    value={width}
                    min={320}
                    max={2000}
                    step={10}
                    onChange={(_event, value) => setWidth(value)}
                />
            </Box>
            {[
                { label: '3 steps', steps: THREE_STEPS },
                { label: '6 steps', steps: SIX_STEPS },
                { label: '10 steps', steps: TEN_STEPS },
            ].map(({ label, steps }) => (
                <Box key={label}>
                    <Typography variant="h6" gutterBottom>
                        {label}
                    </Typography>
                    <Box
                        sx={{
                            maxWidth: width,
                            width: '100%',
                            boxSizing: 'border-box',
                            p: 2,
                            border: 1,
                            borderColor: 'divider',
                        }}
                    >
                        <ResponsiveStepper steps={steps} />
                    </Box>
                </Box>
            ))}
        </Stack>
    );
}

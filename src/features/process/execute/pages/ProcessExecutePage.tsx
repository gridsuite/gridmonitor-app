/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Checkbox, FormControlLabel, Paper, Stack, TextField, Typography } from '@mui/material';
import { useExecuteProcessMutation } from 'shared/api/monitor-api';

const executeProcessSchema = z.object({
    caseUuid: z.string().trim().min(1, 'Case UUID is required'),
    processConfigUuid: z.string().trim().min(1, 'Process config UUID is required'),
    userId: z.string().trim().min(1, 'User ID is required'),
    isDebug: z.boolean().optional(),
});

type ExecuteProcessFormValues = z.infer<typeof executeProcessSchema>;

function getErrorMessage(error: unknown): string {
    if (typeof error === 'object' && error !== null) {
        if ('status' in error && 'data' in error) {
            const apiError = error as { data?: unknown; status?: number | string };

            if (typeof apiError.data === 'string') {
                return apiError.data;
            }

            if (typeof apiError.data === 'object' && apiError.data !== null && 'message' in apiError.data) {
                const { message } = apiError.data as { message?: unknown };
                if (typeof message === 'string') {
                    return message;
                }
            }

            if (apiError.status) {
                return `Request failed with status ${apiError.status}.`;
            }
        }

        if ('message' in error) {
            const { message } = error as { message?: unknown };
            if (typeof message === 'string') {
                return message;
            }
        }
    }

    return 'Failed to execute process.';
}

export function ProcessExecutePage() {
    const [executeProcess, { isLoading }] = useExecuteProcessMutation();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<ExecuteProcessFormValues>({
        resolver: zodResolver(executeProcessSchema),
        defaultValues: {
            caseUuid: '',
            processConfigUuid: '',
            userId: '',
            isDebug: false,
        },
    });

    const onSubmit = async (values: ExecuteProcessFormValues) => {
        setSubmitError(null);
        setSuccessMessage(null);

        try {
            const response = await executeProcess(values).unwrap();
            setSuccessMessage(response || 'Process execution started successfully.');
        } catch (error) {
            setSubmitError(getErrorMessage(error));
        }
    };

    return (
        <Box>
            <Paper sx={{ p: 3 }}>
                <Stack spacing={3} component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            Execute Process
                        </Typography>
                    </Box>

                    {successMessage && <Alert severity="success">{successMessage}</Alert>}
                    {submitError && <Alert severity="error">{submitError}</Alert>}

                    <TextField
                        label="Case UUID"
                        fullWidth
                        {...register('caseUuid')}
                        error={Boolean(errors.caseUuid)}
                        helperText={errors.caseUuid?.message}
                    />

                    <TextField
                        label="Process Config UUID"
                        fullWidth
                        {...register('processConfigUuid')}
                        error={Boolean(errors.processConfigUuid)}
                        helperText={errors.processConfigUuid?.message}
                    />

                    <TextField
                        label="User ID"
                        fullWidth
                        {...register('userId')}
                        error={Boolean(errors.userId)}
                        helperText={errors.userId?.message}
                    />

                    <Controller
                        name="isDebug"
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={Boolean(field.value)}
                                        onChange={(_, checked) => field.onChange(checked)}
                                    />
                                }
                                label="Enable debug mode"
                            />
                        )}
                    />

                    <Box>
                        <Button type="submit" variant="contained" disabled={isLoading}>
                            {isLoading ? 'Starting...' : 'Execute process'}
                        </Button>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
}

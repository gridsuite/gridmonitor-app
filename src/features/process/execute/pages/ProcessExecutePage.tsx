/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FormProvider } from 'react-hook-form';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { ExecuteProcessForm } from '../components/ExecuteProcessForm';
import { ExecuteProcessResult } from '../components/ExecuteProcessResult';
import { useExecuteProcess } from '../hooks/use-execute-process';

function ProcessExecutePage() {
    const { form, onSubmit, result } = useExecuteProcess();

    return (
        <Box>
            <Paper sx={{ p: 3 }}>
                <FormProvider {...form}>
                    <Stack spacing={3}>
                        <Typography variant="h5" gutterBottom>
                            Execute Process
                        </Typography>

                        <ExecuteProcessForm onSubmit={onSubmit} isLoading={result.isLoading} />
                        <ExecuteProcessResult
                            data={result.data}
                            isError={result.isError}
                            isSuccess={result.isSuccess}
                            isLoading={result.isLoading}
                        />
                    </Stack>
                </FormProvider>
            </Paper>
        </Box>
    );
}

export default ProcessExecutePage;

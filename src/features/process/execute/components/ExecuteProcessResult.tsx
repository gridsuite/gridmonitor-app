/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Alert, Stack } from '@mui/material';
import type { ExecuteProcessApiResponse } from '../../../../shared/api/monitor-api';

type ExecuteProcessResultProps = {
    isLoading?: boolean;
    isSuccess?: boolean;
    isError?: boolean;
    data?: ExecuteProcessApiResponse;
};

export function ExecuteProcessResult({ isLoading, isError, isSuccess, data }: Readonly<ExecuteProcessResultProps>) {
    if (isLoading) {
        return (
            <Stack spacing={2}>
                <Alert severity="info">Starting...</Alert>
            </Stack>
        );
    }

    if (isSuccess) {
        return (
            <Stack spacing={2}>
                <Alert severity="success">Newly created execution ID : {data}</Alert>
            </Stack>
        );
    }

    if (!isError) {
        return null;
    }

    return (
        <Stack spacing={2}>
            <Alert severity="error">Failed to execute process.</Alert>
        </Stack>
    );
}

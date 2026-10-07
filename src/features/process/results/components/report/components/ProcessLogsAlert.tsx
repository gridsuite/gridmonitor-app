/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Alert, Paper, Typography } from '@mui/material';

type ProcessLogsProps = {
    isEmpty: boolean;
    isError: boolean;
    isLoading: boolean;
    isMissingExecutionId: boolean;
};

export function ProcessLogsAlert({ isEmpty, isError, isLoading, isMissingExecutionId }: Readonly<ProcessLogsProps>) {
    if (isMissingExecutionId) {
        return <Alert severity="warning">No execution ID provided.</Alert>;
    }

    if (isLoading) {
        return (
            <Paper sx={{ p: 3 }}>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'text.secondary',
                    }}
                >
                    Loading process logs...
                </Typography>
            </Paper>
        );
    }

    if (isError) {
        return <Alert severity="error">Unable to load process logs.</Alert>;
    }

    if (isEmpty) {
        return <Alert severity="info">No process logs found for this execution.</Alert>;
    }

    return null;
}

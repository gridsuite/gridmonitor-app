/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Alert, Paper, Typography } from '@mui/material';

type ProcessResultsResultProps = {
    isEmpty: boolean;
    isError: boolean;
    isLoading: boolean;
};

export function ProcessResultsAlert({ isEmpty, isError, isLoading }: Readonly<ProcessResultsResultProps>) {
    if (isLoading) {
        return (
            <Paper sx={{ p: 3 }}>
                <Typography variant="body1" color="text.secondary">
                    Loading process executions...
                </Typography>
            </Paper>
        );
    }

    if (isError) {
        return <Alert severity="error">Unable to load process executions.</Alert>;
    }

    if (isEmpty) {
        return <Alert severity="info">No process executions found.</Alert>;
    }

    return null;
}

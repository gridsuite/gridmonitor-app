/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Alert, Paper, Typography } from '@mui/material';

type ProcessConfigListResultProps = {
    isEmpty: boolean;
    isError: boolean;
    isLoading: boolean;
};

export function ProcessConfigListResult({ isEmpty, isError, isLoading }: Readonly<ProcessConfigListResultProps>) {
    if (isLoading) {
        return (
            <Paper sx={{ p: 3 }}>
                <Typography variant="body1" color="text.secondary">
                    Loading security analysis configurations...
                </Typography>
            </Paper>
        );
    }

    if (isError) {
        return <Alert severity="error">Unable to load security analysis configurations.</Alert>;
    }

    if (isEmpty) {
        return <Alert severity="info">No security analysis configurations found.</Alert>;
    }

    return null;
}

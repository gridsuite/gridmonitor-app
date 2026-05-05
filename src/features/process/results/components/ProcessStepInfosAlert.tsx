/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Alert, Paper, Typography } from '@mui/material';

type ProcessStepInfosResultProps = {
    isEmpty: boolean;
    isError: boolean;
    isLoading: boolean;
    isMissingExecutionId: boolean;
};

export function ProcessStepInfosAlert({
    isEmpty,
    isError,
    isLoading,
    isMissingExecutionId,
}: Readonly<ProcessStepInfosResultProps>) {
    if (isMissingExecutionId) {
        return <Alert severity="warning">No execution ID provided.</Alert>;
    }

    if (isLoading) {
        return (
            <Paper sx={{ p: 3 }}>
                <Typography variant="body1" color="text.secondary">
                    Loading process step information...
                </Typography>
            </Paper>
        );
    }

    if (isError) {
        return <Alert severity="error">Unable to load process step information.</Alert>;
    }

    if (isEmpty) {
        return <Alert severity="info">No process steps found for this execution.</Alert>;
    }

    return null;
}

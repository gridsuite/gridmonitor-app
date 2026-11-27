/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { ActiveProcessConfigTable } from './list/actives/ActiveProcessConfigTable';
import { HistoryProcessConfigTable } from './list/history/HistoryProcessConfigTable';
import { CreateProcessConfigButton } from './create/CreateProcessConfigButton';

function ProcessConfig() {
    return (
        <Box sx={{ p: 3 }}>
            <Stack>
                <Grid
                    container
                    sx={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography variant="h5">
                        <FormattedMessage id="autoRunConfig" />
                    </Typography>
                    <CreateProcessConfigButton />
                </Grid>
                <ActiveProcessConfigTable />
                <HistoryProcessConfigTable />
            </Stack>
        </Box>
    );
}

export default ProcessConfig;

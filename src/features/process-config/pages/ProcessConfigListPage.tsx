/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { CreateProcessConfigDialog } from '../components/CreateProcessConfigDialog';

function ProcessConfigListPage() {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <Box sx={{ p: 3 }}>
            <Stack>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Typography variant="h5">
                        <FormattedMessage id="referenceConfigs" />
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => setDialogOpen(true)}
                        sx={{ textTransform: 'none' }}
                        startIcon={<Add />}
                    >
                        <FormattedMessage id="createConfig" />
                    </Button>
                </Grid>
                <CreateProcessConfigDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
            </Stack>
        </Box>
    );
}

export default ProcessConfigListPage;

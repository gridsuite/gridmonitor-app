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
import { CreateProcessConfigDialog } from './create/CreateProcessConfigDialog';
import { ProcessConfigListProvider } from './list/ProcessConfigListProvider';
import { ActiveProcessConfigTable } from './list/ActiveProcessConfigTable';
import { HistoryProcessConfigTable } from './list/HistoryProcessConfigTable';
import { useProcessConfigLists } from './list/hooks/use-process-config-lists';

function ProcessConfig() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { activeConfigs, historyConfigs } = useProcessConfigLists();

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
                    <Button variant="contained" onClick={() => setDialogOpen(true)} startIcon={<Add />}>
                        <FormattedMessage id="createConfig" />
                    </Button>
                </Grid>
                <ProcessConfigListProvider>
                    <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                        <FormattedMessage id="activeConfigs" />
                    </Typography>
                    <ActiveProcessConfigTable configs={activeConfigs} />
                    <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                        <FormattedMessage id="configsHistory" />
                    </Typography>
                    <HistoryProcessConfigTable configs={historyConfigs} />
                </ProcessConfigListProvider>
                <CreateProcessConfigDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
            </Stack>
        </Box>
    );
}

export default ProcessConfig;

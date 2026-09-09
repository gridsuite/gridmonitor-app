/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Button, Paper, Stack } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { CreateProcessConfigDialog } from '../components/CreateProcessConfigForm';
import { ProcessConfigList } from '../components/ProcessConfigList';
import { ProcessConfigListResult } from '../components/ProcessConfigListResult';
import { useProcessConfigList } from '../hooks/use-process-config-list';

function ProcessConfigListPage() {
    const { configs, expandedItems, isEmpty, isError, isLoading, onToggleExpanded } = useProcessConfigList();

    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <Box>
            <Paper sx={{ p: 3 }}>
                <Stack>
                    <Button
                        variant="contained"
                        onClick={() => setDialogOpen(true)}
                        sx={{ alignSelf: 'flex-end', textTransform: 'none' }}
                        startIcon={<Add />}
                    >
                        <FormattedMessage id="createConfig" />
                    </Button>

                    <ProcessConfigListResult isEmpty={isEmpty} isError={isError} isLoading={isLoading} />
                    {!isLoading && !isError && !isEmpty && (
                        <ProcessConfigList
                            configs={configs}
                            expandedItems={expandedItems}
                            onToggleExpanded={onToggleExpanded}
                        />
                    )}
                    <CreateProcessConfigDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
                </Stack>
            </Paper>
        </Box>
    );
}

export default ProcessConfigListPage;

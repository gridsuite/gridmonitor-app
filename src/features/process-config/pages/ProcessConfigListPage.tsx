/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Paper } from '@mui/material';
import { ProcessConfigList } from '../components/ProcessConfigList';
import { ProcessConfigListResult } from '../components/ProcessConfigListResult';
import { useProcessConfigList } from '../hooks/use-process-config-list';

function ProcessConfigListPage() {
    const { configs, expandedItems, isEmpty, isError, isLoading, onToggleExpanded } = useProcessConfigList();

    return (
        <Box>
            <Paper sx={{ p: 3 }}>
                <ProcessConfigListResult isEmpty={isEmpty} isError={isError} isLoading={isLoading} />
                {!isLoading && !isError && !isEmpty && (
                    <ProcessConfigList
                        configs={configs}
                        expandedItems={expandedItems}
                        onToggleExpanded={onToggleExpanded}
                    />
                )}
            </Paper>
        </Box>
    );
}

export default ProcessConfigListPage;

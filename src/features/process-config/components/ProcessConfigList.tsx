/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Stack, Typography } from '@mui/material';
import type { PersistedProcessConfig } from 'shared/api/monitor-api';
import { ProcessConfigListItem } from './ProcessConfigListItem';

type ProcessConfigListProps = {
    configs: PersistedProcessConfig[];
    expandedItems: Record<number, boolean>;
    onToggleExpanded: (index: number) => void;
};

export function ProcessConfigList({ configs, expandedItems, onToggleExpanded }: Readonly<ProcessConfigListProps>) {
    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h5" gutterBottom>
                    Security Analysis Configurations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {configs.length} configuration{configs.length === 1 ? '' : 's'} returned by the API.
                </Typography>
            </Box>

            {configs.map((item, index) => (
                <ProcessConfigListItem
                    key={item.id ?? `config-${index}`}
                    expanded={Boolean(expandedItems[index])}
                    index={index}
                    item={item}
                    onToggleExpanded={onToggleExpanded}
                />
            ))}
        </Stack>
    );
}

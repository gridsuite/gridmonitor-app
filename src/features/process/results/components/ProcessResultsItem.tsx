/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Link } from 'react-router';
import { Box, Divider, ListItem, ListItemText, Stack } from '@mui/material';
import type { ProcessExecution } from 'shared/api/monitor-api';
import { PROCESS_PATHS } from '../../router/process-paths';

function formatDate(value?: string) {
    return new Date(value ?? '').toLocaleString();
}

type ProcessResultsItemProps = {
    execution: ProcessExecution;
};

export function ProcessResultsItem({ execution }: Readonly<ProcessResultsItemProps>) {
    return (
        <>
            <ListItem>
                <ListItemText
                    primary={
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
                            <Box>
                                Id : <Link to={PROCESS_PATHS.stepInfos(execution.id ?? '')}>{execution.id}</Link>
                            </Box>
                            <Box>
                                Start : {formatDate(execution.startedAt)}
                                <Divider />
                                End : {formatDate(execution.completedAt)}
                            </Box>
                        </Stack>
                    }
                />
            </ListItem>
            <Divider />
        </>
    );
}

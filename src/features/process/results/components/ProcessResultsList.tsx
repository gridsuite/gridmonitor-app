/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { List, Paper } from '@mui/material';
import type { ProcessExecution } from 'shared/api/monitor-api';
import { ProcessResultsItem } from './ProcessResultsItem';

type ProcessResultsListProps = {
    executions: ProcessExecution[];
};

export function ProcessResultsList({ executions }: Readonly<ProcessResultsListProps>) {
    return (
        <Paper>
            <List dense>
                {executions.map((execution, index) => (
                    <ProcessResultsItem key={execution.id ?? `execution-${index}`} execution={execution} />
                ))}
            </List>
        </Paper>
    );
}

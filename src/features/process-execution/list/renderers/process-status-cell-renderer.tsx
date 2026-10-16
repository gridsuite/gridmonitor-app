/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box } from '@mui/material';
import { Link } from 'react-router';
import { ProcessStatus } from '../../../../shared/api/monitor-api';
import { ExecutionStatus } from '../../../../shared/ui/ExecutionStatus';
import { PROCESS_PATHS } from '../../router/process-paths';

export type ProcessStatusCellRendererProps = { value: ProcessStatus; id: string };

export function ProcessStatusCellRenderer({ value, id }: Readonly<ProcessStatusCellRendererProps>) {
    const linkStyle = {
        color: 'inherit',
        textDecoration: 'none',
    };

    const executionStatus = <ExecutionStatus value={value} />;

    if (value !== ProcessStatus.Completed) {
        return (
            <Link to={PROCESS_PATHS.stepInfos(id ?? '')} onClick={(event) => event.stopPropagation()} style={linkStyle}>
                <Box sx={{ display: 'inline-flex', verticalAlign: 'middle' }}>{executionStatus}</Box>
            </Link>
        );
    }
    return (
        <Link to={PROCESS_PATHS.stepInfos(id ?? '')} onClick={(event) => event.stopPropagation()} style={linkStyle}>
            {executionStatus}
        </Link>
    );
}

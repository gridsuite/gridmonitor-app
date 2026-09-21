/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Box } from '@mui/material';
import { UserAvatar } from '@gridsuite/commons-ui';
import { Link } from 'react-router';
import { PROCESS_PATHS } from '../../../router/process-paths';

export type ProcessUserCellRendererProps = { value: string; backgroundColor: string; id: string };

export function ProcessUserCellRenderer({ value, backgroundColor, id }: Readonly<ProcessUserCellRendererProps>) {
    return (
        <Link
            to={PROCESS_PATHS.stepInfos(id ?? '')}
            onClick={(event) => event.stopPropagation()}
            style={{
                display: 'inline-flex',
                color: 'inherit',
                textDecoration: 'none',
            }}
        >
            <Box sx={{ display: 'inline-flex', verticalAlign: 'middle' }}>
                <UserAvatar label={value} backgroundColor={backgroundColor} />
            </Box>
        </Link>
    );
}

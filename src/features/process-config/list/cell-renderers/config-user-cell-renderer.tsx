/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box } from '@mui/material';
import { UserAvatar } from '@gridsuite/commons-ui';

export type ConfigUserCellRendererProps = { value: string; backgroundColor: string };

export function ConfigUserCellRenderer({ value, backgroundColor }: Readonly<ConfigUserCellRendererProps>) {
    return (
        <Box sx={{ display: 'inline-flex', verticalAlign: 'middle' }}>
            <UserAvatar size="small" label={value} backgroundColor={backgroundColor} />
        </Box>
    );
}

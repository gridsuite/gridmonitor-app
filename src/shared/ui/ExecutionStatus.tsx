/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Done, AccessTime, Autorenew, ErrorOutlineOutlined } from '@mui/icons-material';
import { Chip, Icon, Stack, useTheme } from '@mui/material';
import { cyan, purple } from '@mui/material/colors';
import { useIntl } from 'react-intl';
import { ReactNode } from 'react';
import { ProcessStatus } from 'shared/api/monitor-api';

export function ExecutionStatus({ value }: Readonly<{ value: string }>) {
    const intl = useIntl();
    const theme = useTheme();

    let colorVal: string = '';
    let iconVal: ReactNode = <Icon />;

    switch (value) {
        case ProcessStatus.Failed:
            colorVal = theme.palette.error.main;
            iconVal = <ErrorOutlineOutlined />;
            break;
        case ProcessStatus.Running:
            colorVal = theme.palette.mode === 'light' ? purple.A700 : purple.A100;
            iconVal = <Autorenew />;
            break;
        case ProcessStatus.Scheduled:
            colorVal = theme.palette.mode === 'light' ? cyan[800] : cyan[300];
            iconVal = <AccessTime />;
            break;
        default:
    }

    if (value !== ProcessStatus.Completed) {
        return (
            <Chip
                icon={iconVal}
                label={intl.formatMessage({
                    id: value,
                })}
                size="small"
                variant="outlined"
                sx={{
                    alignSelf: 'center',
                    color: colorVal,
                    borderColor: 'currentColor',
                    '& .MuiChip-icon': {
                        color: 'inherit',
                    },
                }}
            />
        );
    }
    return (
        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
            <Done sx={{ color: 'success.main' }} fontSize="small" />
            <span>
                {intl.formatMessage({
                    id: value,
                })}
            </span>
        </Stack>
    );
}

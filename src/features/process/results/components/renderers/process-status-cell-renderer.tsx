/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Done, AccessTime, Autorenew, ErrorOutlineOutlined } from '@mui/icons-material';
import { Box, Chip, Icon, Stack, useTheme } from '@mui/material';
import { cyan, purple } from '@mui/material/colors';
import { useIntl } from 'react-intl';
import { ReactNode } from 'react';
import { Link } from 'react-router';
import { ProcessStatus } from 'shared/api/monitor-api';
import { PROCESS_PATHS } from '../../../router/process-paths';

export type ProcessStatusCellRendererProps = { value: ProcessStatus; id: string };

export function ProcessStatusCellRenderer({ value, id }: Readonly<ProcessStatusCellRendererProps>) {
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

    const linkStyle = {
        color: 'inherit',
        textDecoration: 'none',
    };

    if (value !== ProcessStatus.Completed) {
        return (
            <Link to={PROCESS_PATHS.stepInfos(id ?? '')} onClick={(event) => event.stopPropagation()} style={linkStyle}>
                <Box sx={{ display: 'inline-flex', verticalAlign: 'middle' }}>
                    <Chip
                        icon={iconVal}
                        label={intl.formatMessage({
                            id: value,
                        })}
                        size="small"
                        variant="outlined"
                        sx={{
                            color: colorVal,
                            borderColor: 'currentColor',
                            '& .MuiChip-icon': {
                                color: 'inherit',
                                marginRight: '1px',
                            },
                        }}
                    />
                </Box>
            </Link>
        );
    }
    return (
        <Link to={PROCESS_PATHS.stepInfos(id ?? '')} onClick={(event) => event.stopPropagation()} style={linkStyle}>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                <Done sx={{ color: 'success.main' }} fontSize="small" />
                <span>
                    {intl.formatMessage({
                        id: value,
                    })}
                </span>
            </Stack>
        </Link>
    );
}

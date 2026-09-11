/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Done, AccessTime, Autorenew, ErrorOutline } from '@mui/icons-material';
import { Box, Chip, Stack } from '@mui/material';
import { useIntl } from 'react-intl';
import { ReactNode } from 'react';
import { Link } from 'react-router';
// eslint-disable-next-line no-restricted-imports
import { ProcessStatus } from '../../../../../shared/api/monitor-api/monitor.generated';
import { PROCESS_PATHS } from '../../../router/process-paths';

export type ProcessStatusCellRendererProps = { value: ProcessStatus; id: string };

export function ProcessStatusCellRenderer({ value, id }: Readonly<ProcessStatusCellRendererProps>) {
    const intl = useIntl();

    let colorVal: string = '';
    let iconVal: ReactNode;

    switch (value) {
        case ProcessStatus.Failed:
            colorVal = 'error.main';
            iconVal = <ErrorOutline />;
            break;
        case ProcessStatus.Running:
            colorVal = 'purple';
            iconVal = <Autorenew />;
            break;
        case ProcessStatus.Scheduled:
            colorVal = 'warning.main';
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
                        // @ts-ignore
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
            <Stack direction="row" alignItems="center" spacing={0.75}>
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

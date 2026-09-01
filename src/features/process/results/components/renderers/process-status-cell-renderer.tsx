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
import { ProcessStatus } from '../../../../../shared/api/monitor-api/monitor.generated'; // eslint-disable-line no-restricted-imports

export type ProcessStatusCellRendererProps = { value: ProcessStatus };

export function ProcessStatusCellRenderer({ value }: Readonly<ProcessStatusCellRendererProps>) {
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

    if (value !== ProcessStatus.Completed) {
        return (
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
        );
    }
    return (
        <Stack direction="row" alignItems="center" spacing={0.75}>
            <Done sx={{ color: 'success.main' }} fontSize="small" />
            <span>
                {intl.formatMessage({
                    id: value,
                })}
            </span>
        </Stack>
    );
}

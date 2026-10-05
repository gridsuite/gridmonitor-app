/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useIntl } from 'react-intl';
import { Box, Tooltip } from '@mui/material';
import { Link } from 'react-router';
import { getFormattedDate } from '../../../../../../../shared/lib/date-time-formatter';
import { PROCESS_PATHS } from '../../../../../router/process-paths';

export type ProcessDateCellRendererProps = { value: string; id: string };

export function ProcessDateCellRenderer({ value, id }: Readonly<ProcessDateCellRendererProps>) {
    const intl = useIntl();

    const { fullDate, formattedDate } = getFormattedDate(intl.locale, value);
    return (
        <Box>
            <Tooltip title={fullDate}>
                <Link
                    to={PROCESS_PATHS.stepInfos(id)}
                    onClick={(event) => event.stopPropagation()}
                    style={{
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    {formattedDate}
                </Link>
            </Tooltip>
        </Box>
    );
}

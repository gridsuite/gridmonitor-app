/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useIntl } from 'react-intl';
import { Box, Tooltip } from '@mui/material';
import { Link } from 'react-router';
import { PROCESS_PATHS } from '../../../router/process-paths';

export type ProcessDateCellRendererProps = { value: string; id: string };

export function ProcessDateCellRenderer({ value, id }: Readonly<ProcessDateCellRendererProps>) {
    const intl = useIntl();

    const todayStart = new Date().setHours(0, 0, 0, 0);
    const dateValue = new Date(value);
    let cellText = '-';
    let fullDate = '';
    if (!Number.isNaN(dateValue.getDate())) {
        const cellMidnight = new Date(value).setHours(0, 0, 0, 0);

        const time = new Intl.DateTimeFormat(intl.locale, {
            timeStyle: 'medium',
            hour12: false,
        }).format(dateValue);
        const displayedDate =
            intl.locale === 'en' ? dateValue.toISOString().substring(0, 10) : dateValue.toLocaleDateString(intl.locale);
        cellText = todayStart === cellMidnight ? time : `${displayedDate} - ${time}`;
        fullDate = new Intl.DateTimeFormat(intl.locale, {
            dateStyle: 'long',
            timeStyle: 'long',
            hour12: false,
        }).format(dateValue);
    }
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
                    {cellText}
                </Link>
            </Tooltip>
        </Box>
    );
}

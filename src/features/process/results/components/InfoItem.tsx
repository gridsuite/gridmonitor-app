/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid, Link, Typography } from '@mui/material';

import { FormattedMessage } from 'react-intl';
import { Link as RouterLink } from 'react-router';
import { UserAvatar } from '@gridsuite/commons-ui';

export enum InfoItemType {
    Text = 'text',
    Url = 'url',
    User = 'user',
}

type InfoItemProps = {
    label: string;
    value: string;
    path?: string;
    infoType?: InfoItemType;
};

export function InfoItem({ label, value, infoType = InfoItemType.Text, path }: Readonly<InfoItemProps>) {
    let content: React.ReactNode;

    switch (infoType) {
        case InfoItemType.User:
            content = <UserAvatar label={value} backgroundColor="grey" />;
            break;

        case InfoItemType.Url:
            content =
                path != null ? (
                    <Link component={RouterLink} to={path} underline="hover">
                        <Typography variant="body2">{value}</Typography>
                    </Link>
                ) : (
                    <Typography variant="body2">{value}</Typography>
                );
            break;

        case InfoItemType.Text:
        default:
            content = <Typography variant="body2">{value}</Typography>;
            break;
    }

    return (
        <Grid size={{ xs: 2, sm: 2 }}>
            <Box>
                <Typography variant="body2" sx={{ mb: 0.5, color: 'text.secondary' }}>
                    <FormattedMessage id={label} />
                </Typography>
                {content}
            </Box>
        </Grid>
    );
}

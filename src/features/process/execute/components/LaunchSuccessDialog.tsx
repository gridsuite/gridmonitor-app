/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CheckCircle } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import { MouseEvent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link as RouterLink, useNavigate } from 'react-router';
import { AppDialog } from 'shared/ui/AppDialog';

export function LaunchSuccessDialog({
    executionId,
    open,
    onClose,
}: {
    readonly executionId: string;
    readonly open: boolean;
    readonly onClose: () => void;
}) {
    const intl = useIntl();
    const navigate = useNavigate();
    const path = `/process/results/${executionId}/step-infos`;
    const title = intl.formatMessage({ id: 'analysisLaunched' });

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
        if (isModifiedClick) {
            return;
        }

        event.preventDefault();

        navigate(path);
        onClose();
    };

    return (
        <AppDialog
            open={open}
            onClose={onClose}
            title={title}
            cancelLabel={<FormattedMessage id="close" />}
            showTitle={false}
            maxWidth="xs"
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <CheckCircle color="primary" sx={{ fontSize: 72, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
                <Link
                    component={RouterLink}
                    to={path}
                    onClick={handleClick}
                    sx={{ color: 'primary.main' }}
                    underline="hover"
                >
                    <FormattedMessage id="followExecution" />
                </Link>
            </Box>
        </AppDialog>
    );
}

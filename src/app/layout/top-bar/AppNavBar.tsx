/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Button, Tab, Tabs, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { NavLink, useLocation } from 'react-router';
import { ListAlt, MiscellaneousServices, PlayArrow } from '@mui/icons-material';
import { type ReactNode, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { LaunchSuccessDialog } from 'features/process-execution/launch/LaunchSuccessDialog';
import { ExecuteProcessConfigDialog } from 'features/process-execution/launch/ExecuteProcessConfigDialog';
import { APP_PATHS } from '../../router/paths';

interface NavBarTab {
    icon: ReactNode;
    labelId: string;
    path: string;
}

const leftTabs: NavBarTab[] = [
    { icon: <MiscellaneousServices />, labelId: 'nav.configuration', path: APP_PATHS.processConfig.root },
    { icon: <ListAlt />, labelId: 'nav.launchHistory', path: APP_PATHS.process.results },
];

function TabLabel({ icon, label }: { readonly icon: ReactNode; readonly label: string }) {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.only('xs'));

    return (
        <Tooltip title={label} disableHoverListener={!isXs} disableFocusListener={!isXs} disableTouchListener={!isXs}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                {icon}
                <Typography sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    <span>{label}</span>
                </Typography>
            </Box>
        </Tooltip>
    );
}

export function SettingsTabs() {
    const location = useLocation();
    const intl = useIntl();

    const currentTab = leftTabs.find((t) => location.pathname.startsWith(t.path))?.path ?? false;

    return (
        <Tabs value={currentTab} textColor="secondary" indicatorColor="secondary">
            {leftTabs.map((tab) => (
                <Tab
                    key={tab.path}
                    value={tab.path}
                    component={NavLink}
                    to={tab.path}
                    label={<TabLabel icon={tab.icon} label={intl.formatMessage({ id: tab.labelId })} />}
                />
            ))}
        </Tabs>
    );
}

export function ExecuteButton() {
    const [wizardOpen, setWizardOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [executionId, setExecutionId] = useState('');

    return (
        <>
            <Button
                color="secondary"
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={() => setWizardOpen(true)}
                sx={{
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    '& .MuiButton-startIcon': {
                        mr: { xs: 0, sm: 1 },
                    },
                }}
            >
                <Typography sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    <FormattedMessage id="nav.executeProcess" />
                </Typography>
            </Button>

            <ExecuteProcessConfigDialog
                open={wizardOpen}
                onClose={() => setWizardOpen(false)}
                onLaunch={(data) => {
                    setExecutionId(data);
                    setWizardOpen(false);
                    setSuccessOpen(true);
                }}
            />

            <LaunchSuccessDialog executionId={executionId} open={successOpen} onClose={() => setSuccessOpen(false)} />
        </>
    );
}

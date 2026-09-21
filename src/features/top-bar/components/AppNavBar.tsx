/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Tabs, Tab, Box, Button, Typography, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { NavLink, useLocation } from 'react-router';
import { PlayArrow, MiscellaneousServices, ListAlt } from '@mui/icons-material';
import { useState, type ReactNode } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { PROCESS_PATHS } from '../../process/router/process-paths';
import { PROCESS_CONFIG_PATHS } from '../../process-config/router/process-config-paths';
import { LaunchSuccessDialog } from '../../process/execute/components/LaunchSuccessDialog';
import { ExecuteProcessConfigDialog } from '../../process/execute/components/ExecuteProcessConfigDialog';

interface NavBarTab {
    icon: ReactNode;
    labelId: string;
    path: string;
}

const leftTabs: NavBarTab[] = [
    { icon: <MiscellaneousServices />, labelId: 'nav.configuration', path: PROCESS_CONFIG_PATHS.root },
    { icon: <ListAlt />, labelId: 'nav.launchHistory', path: PROCESS_PATHS.results },
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
        <Tabs value={currentTab}>
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
                color="primary"
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={() => setWizardOpen(true)}
                sx={{
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                }}
            >
                <FormattedMessage id="nav.executeProcess" />
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

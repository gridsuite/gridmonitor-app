/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Tabs, Tab, Box, Button } from '@mui/material';
import { NavLink, useLocation } from 'react-router';
import { PlayCircleFilled, TableView, SettingsInputComponent } from '@mui/icons-material';
import type { ReactNode } from 'react';
import { useIntl } from 'react-intl';
import { isConfigurationPath } from 'app/router/app-paths';
import { PROCESS_PATHS } from '../../process/router/process-paths';
import { PROCESS_CONFIG_PATHS } from '../../process-config/router/process-config-paths';

interface NavBarTab {
    icon: ReactNode;
    labelId: string;
    path: string;
}

const leftTabs: NavBarTab[] = [
    { icon: <SettingsInputComponent />, labelId: 'nav.configuration', path: PROCESS_CONFIG_PATHS.root },
    { icon: <TableView />, labelId: 'nav.launchHistory', path: PROCESS_PATHS.results },
];

const executeTab: NavBarTab = {
    icon: <PlayCircleFilled />,
    labelId: 'nav.executeProcess',
    path: PROCESS_PATHS.execute,
};

function TabLabel({ icon, label }: { icon: ReactNode; label: string }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
            {icon}
            <span>{label}</span>
        </Box>
    );
}

export function SettingsTabs() {
    const location = useLocation();
    const intl = useIntl();

    if (!isConfigurationPath(location.pathname)) {
        return null;
    }

    const currentTab = [...leftTabs, executeTab].find((t) => location.pathname.startsWith(t.path))?.path ?? false;

    return (
        <Tabs value={currentTab}>
            {leftTabs.map((tab) => (
                <Tab
                    key={tab.path}
                    value={tab.path}
                    component={NavLink}
                    to={tab.path}
                    label={<TabLabel icon={tab.icon} label={intl.formatMessage({ id: tab.labelId })} />}
                    sx={{ textTransform: 'none' }}
                />
            ))}
        </Tabs>
    );
}

export function ExecuteButton() {
    const location = useLocation();
    const intl = useIntl();

    if (!isConfigurationPath(location.pathname)) {
        return null;
    }

    const isSelected = location.pathname.startsWith(executeTab.path);

    return (
        <Button
            component={NavLink}
            to={executeTab.path}
            color="inherit"
            variant={isSelected ? 'outlined' : 'text'}
            startIcon={executeTab.icon}
            sx={{ textTransform: 'none', mr: 1 }}
        >
            {intl.formatMessage({ id: executeTab.labelId })}
        </Button>
    );
}

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Tabs, Tab } from '@mui/material';
import { NavLink, useLocation } from 'react-router';
import { PlayCircleFilled, TableView, SettingsInputComponent } from '@mui/icons-material';
import type { ReactNode } from 'react';
import { PROCESS_PATHS } from '../../process/router/process-paths';
import { PROCESS_CONFIG_PATHS } from '../../process-config/router/process-config-paths';

interface NavBarTab {
    icon: ReactNode;
    path: string;
}

const tabs: NavBarTab[] = [
    { icon: <PlayCircleFilled />, path: PROCESS_PATHS.execute },
    { icon: <TableView />, path: PROCESS_PATHS.results },
    { icon: <SettingsInputComponent />, path: PROCESS_CONFIG_PATHS.root },
];

export function SettingsTabs() {
    const location = useLocation();
    const currentTab = tabs.find((t) => location.pathname.startsWith(t.path))?.path ?? false;

    return (
        <Tabs value={currentTab}>
            {tabs.map((tab) => (
                <Tab key={tab.path} label={tab.icon} value={tab.path} component={NavLink} to={tab.path} />
            ))}
        </Tabs>
    );
}

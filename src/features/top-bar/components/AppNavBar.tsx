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
    const currentTab = (() => {
        if (location.pathname.startsWith(PROCESS_PATHS.results)) {
            return PROCESS_PATHS.results;
        }
        if (location.pathname.startsWith(PROCESS_PATHS.execute)) {
            return PROCESS_PATHS.execute;
        }
        return location.pathname;
    })();

    return (
        <Tabs value={currentTab}>
            {tabs.map((tab) => (
                <Tab key={tab.path} label={tab.icon} value={tab.path} component={NavLink} to={tab.path} />
            ))}
        </Tabs>
    );
}

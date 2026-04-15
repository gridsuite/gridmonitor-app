import { Tabs, Tab } from '@mui/material';
import { NavLink, useLocation } from 'react-router';
import { PlayCircleFilled, TableView } from '@mui/icons-material';
import type { ReactNode } from 'react';

interface NavBarTab {
    icon: ReactNode;
    path: string;
}

const tabs: NavBarTab[] = [
    { icon: <PlayCircleFilled />, path: '/process/execute' },
    { icon: <TableView />, path: '/process/results' },
];

export function SettingsTabs() {
    const location = useLocation();

    return (
        <Tabs value={location.pathname}>
            {tabs.map((tab) => (
                <Tab key={tab.path} label={tab.icon} value={tab.path} component={NavLink} to={tab.path} />
            ))}
        </Tabs>
    );
}

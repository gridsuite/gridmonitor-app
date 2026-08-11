import { AccountBox, Apps, DisplaySettings, Logout } from '@mui/icons-material';
import React, { ReactElement, ReactNode } from 'react';
import { Icon } from '@mui/material';
import { DarkModeToggle } from './sub-menus/DarkModeToggle';

interface BaseMenuItemType {
    id: string;
}

export interface StandardSubMenuItem extends BaseMenuItemType {
    type?: 'standard';
    label: string;
    Icon?: React.ElementType;
    subMenus?: MenuItem[];
}

export interface CustomSubMenuItem extends BaseMenuItemType {
    type: 'custom';
    render: React.ReactNode;
}

export type MenuItem = StandardSubMenuItem | CustomSubMenuItem;

export const applicationSubMenuItems: MenuItem[] = [
    {
        id: 'gridexplore',
        label: 'GridExplore',
    },
];

export const settingsSubMenuItems: MenuItem[] = [
    {
        type: 'custom',
        id: 'themeMode',
        render: <DarkModeToggle />,
    },
];

export const sideBarMenuItems: MenuItem[] = [
    {
        id: 'myApp',
        label: 'Mes applications',
        subMenus: applicationSubMenuItems,
        Icon: Apps,
    },
    {
        id: 'profile',
        label: 'Profil',
        Icon: AccountBox, // TODO: change to actual icon
    },
    {
        id: 'settings',
        label: 'Réglages',
        subMenus: settingsSubMenuItems,
        Icon: DisplaySettings,
    },
    {
        id: 'logout',
        label: 'Se déconnecter',
        Icon: Logout,
    },
];

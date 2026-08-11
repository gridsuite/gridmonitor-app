import { AccountBox, Apps, DisplaySettings, Logout } from '@mui/icons-material';
import React, { ReactElement, ReactNode } from 'react';

export interface MenuItemType {
    id: string;
    subMenus?: MenuItemType[];
    label: string;
}

export interface SideBarMenuItem extends MenuItemType {
    Icon: React.ElementType;
}

export const applicationSubMenuItems: MenuItemType[] = [
    {
        id: 'gridexplore',
        label: 'GridExplore',
    },
];

export const sideBarMenuItems: SideBarMenuItem[] = [
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
        Icon: DisplaySettings,
    },
    {
        id: 'logout',
        label: 'Se déconnecter',
        Icon: Logout,
    },
];

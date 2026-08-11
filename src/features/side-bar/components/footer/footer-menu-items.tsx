import { AccountBox, Apps, DisplaySettings, Logout } from '@mui/icons-material';
import React from 'react';
import { DarkModeToggle } from './sub-menus/DarkModeToggle';
import { GsLang } from '@gridsuite/commons-ui';
import { LanguageSelection } from './sub-menus/LanguageSelection';

interface BaseMenuItemType {
    id: string;
}

export interface StandardSubMenuItem extends BaseMenuItemType {
    type?: 'standard';
    label: string;
    Icon?: React.ElementType;
    onClick?: () => void;
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

export const LANG_SYSTEM = 'sys';
export const LANG_ENGLISH = 'en';
export const LANG_FRENCH = 'fr';

const availableLanguages: GsLang[] = [LANG_SYSTEM, LANG_FRENCH, LANG_ENGLISH];
const languageSubMenuItems: MenuItem[] = availableLanguages.map((language) => ({
    type: 'custom',
    id: language,
    render: <LanguageSelection language={language} />,
}));
export const settingsSubMenuItems: MenuItem[] = [
    {
        type: 'custom',
        id: 'themeMode',
        render: <DarkModeToggle />,
    },
    {
        id: 'selectLanguage',
        label: 'Langue',
        subMenus: languageSubMenuItems,
    },
];

interface SideBarMenuItemsArgs {
    onProfileClick: () => void;
}

export const sideBarMenuItems = ({ onProfileClick }: SideBarMenuItemsArgs): MenuItem[] => [
    {
        id: 'myApps',
        label: 'Mes applications',
        subMenus: applicationSubMenuItems,
        Icon: Apps,
    },
    {
        id: 'profile',
        label: 'Profil',
        Icon: AccountBox, // TODO: change to actual icon
        onClick: onProfileClick,
    },
    {
        id: 'settings',
        label: 'Réglages',
        subMenus: settingsSubMenuItems,
        Icon: DisplaySettings,
    },
];

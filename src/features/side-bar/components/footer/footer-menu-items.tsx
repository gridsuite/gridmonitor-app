import { AccountBox, Apps, DisplaySettings, ManageAccounts, Badge } from '@mui/icons-material';
import React from 'react';
import { GsLang } from '@gridsuite/commons-ui';
import GridexploreLogo from 'assets/images/gridexplore_logo.svg?react';
import { MenuItem } from '@mui/material';
import { DarkModeToggle } from './sub-menus/DarkModeToggle';
import { LanguageSelection } from './sub-menus/LanguageSelection';
import { OtherAppRedirection } from './sub-menus/OtherAppRedirection';
import { ProfileInfos } from './sub-menus/ProfileInfos';
import { UserProfile } from '../../../authentication/store/authentication.type';
import { UserAvatarIcon } from './icon/UserIcon';

interface BaseMenuItemType {
    id: string;
}

export interface StandardSubMenuItem extends BaseMenuItemType {
    type?: 'standard';
    label: string;
    Icon?: React.ReactNode;
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
        type: 'custom',
        id: 'gridexplore',
        render: <OtherAppRedirection AppLogo={GridexploreLogo} appName="GridExplore" />,
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

interface ProfileSubMenuItemsArgs {
    onProfileClick: () => void;
    onProfileSettingsClick: () => void;
    userProfile?: UserProfile;
}

export const profileSubMenuItems = ({
    onProfileClick,
    onProfileSettingsClick,
    userProfile,
}: ProfileSubMenuItemsArgs): MenuItem[] => [
    {
        type: 'custom',
        id: 'profileInfos',
        render: <ProfileInfos userProfile={userProfile} />,
    },
    {
        id: 'userInfos',
        label: 'Informations utilisateur',
        Icon: <Badge />,
        onClick: onProfileClick,
    },
    {
        id: 'userParams',
        label: 'Paramètres utilisateurs',
        Icon: <ManageAccounts />,
        onClick: onProfileSettingsClick,
    },
];

interface SideBarMenuItemsArgs {
    onProfileClick: () => void;
    onProfileSettingsClick: () => void;
    userProfile?: UserProfile;
}

export const sideBarMenuItems = ({
    onProfileClick,
    onProfileSettingsClick,
    userProfile,
}: SideBarMenuItemsArgs): MenuItem[] => [
    {
        id: 'myApps',
        label: 'Mes applications',
        subMenus: applicationSubMenuItems,
        Icon: <Apps />,
    },
    {
        id: 'profile',
        label: 'Profil',
        Icon: <UserAvatarIcon label={userProfile?.name ?? ''} />, // TODO: change to actual icon
        subMenus: profileSubMenuItems({ onProfileClick, onProfileSettingsClick, userProfile }),
    },
    {
        id: 'settings',
        label: 'Réglages',
        subMenus: settingsSubMenuItems,
        Icon: <DisplaySettings />,
    },
];

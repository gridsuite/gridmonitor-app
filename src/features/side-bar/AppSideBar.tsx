/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    AppSideBar as CommonAppSideBar,
    DARK_THEME,
    fetchAppsMetadata,
    LIGHT_THEME,
    Metadata,
    PARAM_DEVELOPER_MODE,
    PARAM_LANGUAGE,
    PARAM_THEME,
} from '@gridsuite/commons-ui';
import { createTheme } from '@mui/material';
import { blueGrey, deepPurple } from '@mui/material/colors';
import { useEffect, useMemo, useState } from 'react';
import GridmonitorLogoLight from 'assets/images/gridmonitor_logo_light.svg?react';
import GridmonitorLogoDark from 'assets/images/gridmonitor_logo_dark.svg?react';
import { usePreference } from '../preferences/hooks/use-preference';
import { APP_NAME } from '../../shared/config/application';
import { getAppTheme } from '../../app/config/app-theme';
import { useStableUserProfile } from '../authentication/hooks/use-stable-user-profile';
import { fetchVersion } from '../../shared/config/version';
import { useGetServersInfos } from './hooks/use-get-servers-infos';
import AppPackage from '../../../package.json';

type SideBarProps = {
    onLogoutClick?: () => void;
};

export function AppSideBar({ onLogoutClick }: Readonly<SideBarProps>) {
    const getServersInfos = useGetServersInfos();
    const [currentTheme, setTheme] = usePreference(PARAM_THEME);
    const [selectedLanguage, setSelectedLanguage] = usePreference(PARAM_LANGUAGE);
    const [isDeveloperMode, handleChangeDeveloperMode] = usePreference(PARAM_DEVELOPER_MODE);
    const userProfile = useStableUserProfile() ?? undefined;
    const [appsAndUrls, setAppsAndUrls] = useState<Metadata[]>([]);
    const isDarkMode = currentTheme === DARK_THEME;
    const invertedThemeId = isDarkMode ? LIGHT_THEME : DARK_THEME;
    const invertedTheme = useMemo(() => {
        const baseTheme = getAppTheme(invertedThemeId);
        const overrideBackgroundColor = invertedThemeId === DARK_THEME ? blueGrey[900] : blueGrey[50];

        return createTheme(baseTheme, {
            palette: {
                background: {
                    paper: overrideBackgroundColor,
                    default: overrideBackgroundColor,
                },
            },
        });
    }, [invertedThemeId]);

    useEffect(() => {
        if (userProfile) {
            fetchAppsMetadata()
                .then((metadata) => {
                    setAppsAndUrls(metadata);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [userProfile]);

    return (
        <CommonAppSideBar
            sideBarTheme={invertedTheme}
            isDeveloperMode={isDeveloperMode}
            smallScreenBreakpoint={invertedTheme.breakpoints.values.sm}
            handleChangeDeveloperMode={handleChangeDeveloperMode}
            currentTheme={currentTheme}
            setTheme={setTheme}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            appName={APP_NAME}
            appNameColor={isDarkMode ? deepPurple[400] : deepPurple.A100}
            appLogo={isDarkMode ? <GridmonitorLogoDark /> : <GridmonitorLogoLight />}
            userProfile={userProfile}
            globalVersionPromise={() => fetchVersion().then((res) => res.deployVersion ?? 'unknown')}
            additionalModulesPromise={getServersInfos}
            onLogoutClick={onLogoutClick}
            appsAndUrls={appsAndUrls}
            appVersion={AppPackage.version}
            appLicense={AppPackage.license}
        />
    );
}

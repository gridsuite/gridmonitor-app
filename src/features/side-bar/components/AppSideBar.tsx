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
import { useEffect, useMemo, useState } from 'react';
import GridmonitorLogoLight from 'assets/images/gridmonitor_logo_light.svg?react';
import GridmonitorLogoDark from 'assets/images/gridmonitor_logo_dark.svg?react';
import { useAppParameterState } from '../../app-parameters/hooks/use-app-parameter-state';
import { APP_NAME } from '../../../app/config/app-config';
import { getAppTheme } from '../../../app/config/app-theme';
import { useStableUserProfile } from '../../authentication/hooks/use-stable-user-profile';
import { fetchVersion } from '../../../shared/config/version';
import { getServersInfos } from '../../top-bar/api/get-servers-infos';
import AppPackage from '../../../../package.json';

type SideBarProps = {
    onLogoutClick?: () => void;
};

export function AppSideBar({ onLogoutClick }: Readonly<SideBarProps>) {
    const [currentTheme, setTheme] = useAppParameterState(PARAM_THEME);
    const [selectedLanguage, setSelectedLanguage] = useAppParameterState(PARAM_LANGUAGE);
    const [isDeveloperMode, handleChangeDeveloperMode] = useAppParameterState(PARAM_DEVELOPER_MODE);
    const userProfile = useStableUserProfile() ?? undefined;
    const [appsAndUrls, setAppsAndUrls] = useState<Metadata[]>([]);
    const isDarkMode = currentTheme === DARK_THEME;
    const invertedThemeId = isDarkMode ? LIGHT_THEME : DARK_THEME;
    const appTheme = getAppTheme(currentTheme);
    const invertedTheme = useMemo(() => {
        const baseTheme = getAppTheme(invertedThemeId);
        const overrideBackgroundColor = baseTheme.palette.sidebar.background;

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
            smallScreenBreakpoint={appTheme.breakpoints.values.sm}
            handleChangeDeveloperMode={handleChangeDeveloperMode}
            currentTheme={currentTheme}
            setTheme={setTheme}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            appName={APP_NAME}
            appNameColor={appTheme.palette.sidebar.appName}
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

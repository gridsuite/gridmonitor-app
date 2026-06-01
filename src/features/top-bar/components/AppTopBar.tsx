/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import {
    fetchAppsMetadata,
    logout,
    Metadata,
    PARAM_LANGUAGE,
    PARAM_THEME,
    TopBar,
    UserManagerState,
} from '@gridsuite/commons-ui';
import { useNavigate } from 'react-router';
import { APP_NAME } from 'app/config/app-config';
import PowsyblLogo from 'assets/images/powsybl_logo.svg?react';
import { useAppParameterState } from 'features/app-parameters/hooks/use-app-parameter-state';
import { useAppDispatch } from 'app/store/store';
import { fetchVersion } from 'shared/config/version';
import type { UserProfile } from 'oidc-client-ts';
import { getServersInfos } from '../api/get-servers-infos';
import AppPackage from '../../../../package.json';
import { SettingsTabs } from './AppNavBar';

export type AppTopBarProps = {
    userProfile?: UserProfile;
    userManager: UserManagerState;
};

function AppTopBar({ userProfile, userManager }: Readonly<AppTopBarProps>) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [appsAndUrls, setAppsAndUrls] = useState<Metadata[]>([]);
    const [themeLocal, handleChangeTheme] = useAppParameterState(PARAM_THEME);
    const [languageLocal, handleChangeLanguage] = useAppParameterState(PARAM_LANGUAGE);

    useEffect(() => {
        if (userProfile !== null) {
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
        <TopBar
            appName={APP_NAME}
            appColor="grey"
            appLogo={<PowsyblLogo />}
            appVersion={AppPackage.version}
            appLicense={AppPackage.license}
            onLogoutClick={() => logout(dispatch, userManager.instance)}
            onLogoClick={() => navigate('/', { replace: true })}
            userProfile={userProfile ?? undefined}
            appsAndUrls={appsAndUrls}
            globalVersionPromise={() => fetchVersion().then((res) => res?.deployVersion ?? 'unknown')}
            additionalModulesPromise={getServersInfos}
            onThemeClick={handleChangeTheme}
            theme={themeLocal}
            onLanguageClick={handleChangeLanguage}
            language={languageLocal}
        >
            <SettingsTabs />
        </TopBar>
    );
}
export default AppTopBar;

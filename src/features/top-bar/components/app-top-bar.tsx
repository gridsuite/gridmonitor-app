/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import {
    fetchAppsMetadata,
    LIGHT_THEME,
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
import { AuthenticationState } from 'features/authentication/store/authentication.type';
import { fetchVersion } from 'shared/config/version';
import { getServersInfos } from '../api/get-servers-infos';
import AppPackage from '../../../../package.json';

export type AppTopBarProps = {
    user?: AuthenticationState['user'];
    userManager: UserManagerState;
};

function AppTopBar({ user, userManager }: Readonly<AppTopBarProps>) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [appsAndUrls, setAppsAndUrls] = useState<Metadata[]>([]);
    const [themeLocal, handleChangeTheme] = useAppParameterState(PARAM_THEME);
    const [languageLocal, handleChangeLanguage] = useAppParameterState(PARAM_LANGUAGE);

    useEffect(() => {
        if (user !== null) {
            fetchAppsMetadata()
                .then((metadata) => {
                    setAppsAndUrls(metadata);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [user]);

    return (
        <TopBar
            appName={APP_NAME}
            appColor="grey"
            appLogo={
                themeLocal === LIGHT_THEME ? (
                    <PowsyblLogo /> // GridXXXLogoLight
                ) : (
                    <PowsyblLogo /> // GridXXXLogoDark
                )
            }
            appVersion={AppPackage.version}
            appLicense={AppPackage.license}
            onLogoutClick={() => logout(dispatch, userManager.instance)}
            onLogoClick={() => navigate('/', { replace: true })}
            user={user ?? undefined}
            appsAndUrls={appsAndUrls}
            globalVersionPromise={() => fetchVersion().then((res) => res?.deployVersion ?? 'unknown')}
            additionalModulesPromise={getServersInfos}
            onThemeClick={handleChangeTheme}
            theme={themeLocal}
            onLanguageClick={handleChangeLanguage}
            language={languageLocal}
        />
    );
}
export default AppTopBar;

/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useMemo, useState } from 'react';
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
import { useDispatch } from 'react-redux';
import PowsyblLogo from 'assets/images/powsybl_logo.svg?react';
import { useAppParameterState } from 'features/app-parameters/hooks/use-app-parameter-state';
import { AuthenticationState } from 'features/authentication/store/authentication.type';
import { fetchVersion } from 'shared/config/version';
import { AnyAppDispatch } from 'shared/store/state.type';
import { getAppName } from 'shared/config/config-params';
import { getServersInfos } from '../api/get-servers-infos';
import AppPackage from '../../../../package.json';
import { SettingsTabs } from './AppNavBar';

export type AppTopBarProps = {
    user?: AuthenticationState['user'];
    userManager: UserManagerState;
};

function AppTopBar({ user, userManager }: Readonly<AppTopBarProps>) {
    const navigate = useNavigate();
    const dispatch = useDispatch<AnyAppDispatch>();
    const isAuthenticated = user !== null;
    const [appsAndUrls, setAppsAndUrls] = useState<Metadata[]>([]);
    const [themeLocal, handleChangeTheme] = useAppParameterState({
        paramName: PARAM_THEME,
        isAuthenticated,
    });
    const [languageLocal, handleChangeLanguage] = useAppParameterState({
        paramName: PARAM_LANGUAGE,
        isAuthenticated,
    });

    useEffect(() => {
        if (isAuthenticated) {
            fetchAppsMetadata()
                .then((metadata) => {
                    setAppsAndUrls(metadata);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [isAuthenticated]);

    const serversInfosModulePromise = useMemo(() => {
        return () => getServersInfos(dispatch);
    }, [dispatch]);

    return (
        <TopBar
            appName={getAppName()}
            appColor="grey"
            appLogo={<PowsyblLogo />}
            appVersion={AppPackage.version}
            appLicense={AppPackage.license}
            onLogoutClick={() => logout(dispatch, userManager.instance)}
            onLogoClick={() => navigate('/', { replace: true })}
            user={user ?? undefined}
            appsAndUrls={appsAndUrls}
            globalVersionPromise={() => fetchVersion().then((res) => res?.deployVersion ?? 'unknown')}
            additionalModulesPromise={serversInfosModulePromise}
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

/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import { useLocation, useMatch, useNavigate } from 'react-router';
import { AuthenticationRouter, CardErrorBoundary, initializeAuthenticationProd, logout } from '@gridsuite/commons-ui';
import {
    selectAuthenticationRouterError,
    selectShowAuthenticationRouterLogin,
    selectSignInCallbackError,
} from 'features/authentication/store/authentication.selectors';
import { getErrorMessage } from 'shared/lib/error';
import { fetchIdpSettings } from 'shared/config/idp-settings';
import AppTopBar, { AppTopBarProps } from 'features/top-bar/components/AppTopBar';
import { useAppParametersInvalidationListener } from './notifications/use-app-parameters-invalidation-listener';
import { useProcessInvalidationsListener } from './notifications/use-process-invalidation-listener';
import { useAppDispatch, useAppSelector } from './store/store';
import { AppRouter } from './router/AppRouter';
import { useStableUserProfile } from '../features/authentication/hooks/use-stable-user-profile';
import { AppLayout } from './layout/AppLayout';

function App() {
    const userProfile = useStableUserProfile();
    const signInCallbackError = useAppSelector(selectSignInCallbackError);
    const authenticationRouterError = useAppSelector(selectAuthenticationRouterError);
    const showAuthenticationRouterLogin = useAppSelector(selectShowAuthenticationRouterLogin);

    const [userManager, setUserManager] = useState<AppTopBarProps['userManager']>({ instance: null, error: null });

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const location = useLocation();

    // Can't use lazy initializer because useMatch is a hook
    const [initialMatchSilentRenewCallbackUrl] = useState(
        useMatch({
            path: '/silent-renew-callback',
        })
    );

    const [initialMatchSigninCallbackUrl] = useState(
        useMatch({
            path: '/sign-in-callback',
        })
    );

    useEffect(() => {
        // need subfunction when async as suggested by rule react-hooks/exhaustive-deps
        (async function initializeAuthentication() {
            try {
                setUserManager({
                    instance: await initializeAuthenticationProd(
                        dispatch,
                        initialMatchSilentRenewCallbackUrl != null,
                        fetchIdpSettings,
                        initialMatchSigninCallbackUrl != null
                    ),
                    error: null,
                });
            } catch (error) {
                setUserManager({
                    instance: null,
                    error: getErrorMessage(error),
                });
            }
        })();
        // Note: dispatch and initialMatchSilentRenewCallbackUrl won't change
    }, [initialMatchSigninCallbackUrl, initialMatchSilentRenewCallbackUrl, dispatch]);

    useAppParametersInvalidationListener();
    useProcessInvalidationsListener();

    const onLogoutClick = () => logout(dispatch, userManager.instance)?.catch((err) => console.error(err));

    return (
        <AppLayout onLogoutClick={onLogoutClick}>
            <AppTopBar userProfile={userProfile} userManager={userManager} />
            <CardErrorBoundary>
                {userProfile !== null ? (
                    <AppRouter />
                ) : (
                    <AuthenticationRouter
                        userManager={userManager}
                        signInCallbackError={signInCallbackError}
                        authenticationRouterError={authenticationRouterError}
                        showAuthenticationRouterLogin={showAuthenticationRouterLogin}
                        dispatch={dispatch}
                        navigate={navigate}
                        location={location}
                    />
                )}
            </CardErrorBoundary>
        </AppLayout>
    );
}
export default App;

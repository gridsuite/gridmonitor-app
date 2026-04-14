/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { RootState } from 'app/store/store';

export const selectAuthentication = (state: RootState) => state.authentication;
export const selectUser = (state: RootState) => selectAuthentication(state).user;
export const selectSignInCallbackError = (state: RootState) => selectAuthentication(state).signInCallbackError;

export const selectAuthenticationRouterError = (state: RootState) =>
    selectAuthentication(state).authenticationRouterError;

export const selectShowAuthenticationRouterLogin = (state: RootState) =>
    selectAuthentication(state).showAuthenticationRouterLogin;

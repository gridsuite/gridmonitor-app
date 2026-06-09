/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { StateWithAuthentication } from './authentication.type';

export const selectAuthentication = (state: StateWithAuthentication) => state.authentication;
export const selectUser = (state: StateWithAuthentication) => selectAuthentication(state).user;
export const selectToken = (state: StateWithAuthentication) => selectUser(state)?.id_token;
export const selectSignInCallbackError = (state: StateWithAuthentication) =>
    selectAuthentication(state).signInCallbackError;

export const selectAuthenticationRouterError = (state: StateWithAuthentication) =>
    selectAuthentication(state).authenticationRouterError;

export const selectShowAuthenticationRouterLogin = (state: StateWithAuthentication) =>
    selectAuthentication(state).showAuthenticationRouterLogin;

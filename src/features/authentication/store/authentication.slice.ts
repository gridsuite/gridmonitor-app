/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSlice, Draft } from '@reduxjs/toolkit';
import {
    AuthenticationRouterErrorAction,
    LOGOUT_ERROR,
    LogoutErrorAction,
    RESET_AUTHENTICATION_ROUTER_ERROR,
    SHOW_AUTH_INFO_LOGIN,
    ShowAuthenticationRouterLoginAction,
    SIGNIN_CALLBACK_ERROR,
    SignInCallbackErrorAction,
    UNAUTHORIZED_USER_INFO,
    UnauthorizedUserAction,
    USER,
    USER_VALIDATION_ERROR,
    UserAction,
    UserValidationErrorAction,
} from '@gridsuite/commons-ui';
import { AuthenticationState } from './authentication.type';

const initialState: AuthenticationState = {
    user: null,
    signInCallbackError: null,
    authenticationRouterError: null,
    showAuthenticationRouterLogin: false,
};

const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(USER, (state: Draft<AuthenticationState>, action: UserAction) => {
            state.user = action.user;
        });
        builder.addCase(
            SIGNIN_CALLBACK_ERROR,
            (state: Draft<AuthenticationState>, action: SignInCallbackErrorAction) => {
                state.signInCallbackError = action.signInCallbackError;
            }
        );

        builder.addCase(UNAUTHORIZED_USER_INFO, (state: Draft<AuthenticationState>, action: UnauthorizedUserAction) => {
            state.authenticationRouterError = action.authenticationRouterError;
        });

        builder.addCase(LOGOUT_ERROR, (state: Draft<AuthenticationState>, action: LogoutErrorAction) => {
            state.authenticationRouterError = action.authenticationRouterError;
        });

        builder.addCase(
            USER_VALIDATION_ERROR,
            (state: Draft<AuthenticationState>, action: UserValidationErrorAction) => {
                state.authenticationRouterError = action.authenticationRouterError;
            }
        );

        builder.addCase(
            RESET_AUTHENTICATION_ROUTER_ERROR,
            (state: Draft<AuthenticationState>, _action: AuthenticationRouterErrorAction) => {
                state.authenticationRouterError = null;
            }
        );

        builder.addCase(
            SHOW_AUTH_INFO_LOGIN,
            (state: Draft<AuthenticationState>, action: ShowAuthenticationRouterLoginAction) => {
                state.showAuthenticationRouterLogin = action.showAuthenticationRouterLogin;
            }
        );
    },
});

export const authenticationReducer = authenticationSlice.reducer;

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// TODO: Temporary workaround for Vitest + MUI v6 incompatibilities in tests.
// Avoids loading MUI during test execution.
// Remove after upgrading to MUI v7 or applying a proper fix.
// See: https://github.com/mui/material-ui/issues/45599
export const DARK_THEME = 'dark';
export const LIGHT_THEME = 'light';
export const LANG_SYSTEM = 'system';
export const PARAM_THEME = 'theme';
export const PARAM_LANGUAGE = 'language';

const COMMON_CONFIG_PARAMS_NAMES = new Set([PARAM_THEME, PARAM_LANGUAGE]);

export const getAppName = (appName: string, name: string) =>
    COMMON_CONFIG_PARAMS_NAMES.has(name) ? 'common' : appName;

export const USER = 'USER';
export const SIGNIN_CALLBACK_ERROR = 'SIGNIN_CALLBACK_ERROR';
export const UNAUTHORIZED_USER_INFO = 'UNAUTHORIZED_USER_INFO';
export const LOGOUT_ERROR = 'LOGOUT_ERROR';
export const USER_VALIDATION_ERROR = 'USER_VALIDATION_ERROR';
export const RESET_AUTHENTICATION_ROUTER_ERROR = 'RESET_AUTHENTICATION_ROUTER_ERROR';
export const SHOW_AUTH_INFO_LOGIN = 'SHOW_AUTH_INFO_LOGIN';

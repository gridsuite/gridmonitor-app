/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { vi } from 'vitest';
import { createElement, type PropsWithChildren, type ReactNode } from 'react';

// TODO: Temporary workaround for Vitest + MUI v6 incompatibilities in tests.
// Avoids loading MUI during test execution.
// Remove after upgrading to MUI v7 or applying a proper fix.
// See: https://github.com/mui/material-ui/issues/45599
export const DARK_THEME = 'dark';
export const LIGHT_THEME = 'light';
export const LANG_SYSTEM = 'system';
export const PARAM_THEME = 'theme';
export const PARAM_LANGUAGE = 'language';
export const PARAM_DEVELOPER_MODE = 'isDeveloperMode';

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
export const useNotificationsListener = vi.fn();

export enum NotificationsUrlKeys {
    CONFIG = 'CONFIG',
    MONITOR = 'MONITOR',
}
export const PREFIX_CONFIG_NOTIFICATION_WS = `${import.meta.env.VITE_WS_GATEWAY}/config-notification`;
export const PREFIX_MONITOR_NOTIFICATION_WS = `${import.meta.env.VITE_WS_GATEWAY}/monitor-notification`;
export const SnackbarProvider = ({ children }: PropsWithChildren): ReactNode => children;
export const CardErrorBoundary = ({ children }: PropsWithChildren): ReactNode => children;
export function AuthenticationRouter() {
    return null;
}
export const initializeAuthenticationProd = () => Promise.resolve(null);
export function TopBar({ appName, children }: PropsWithChildren<{ appName?: ReactNode }>): ReactNode {
    return createElement('div', { 'data-testid': 'top-bar' }, appName, children);
}
type CommonStoreState = {
    user?: {
        id_token?: string;
    } | null;
};

type CommonStore = {
    getState(): CommonStoreState;
};

let commonStore: CommonStore | undefined;

export function setCommonStore(store: CommonStore): void {
    commonStore = store;
}

export function getUserToken() {
    return commonStore?.getState().user?.id_token;
}

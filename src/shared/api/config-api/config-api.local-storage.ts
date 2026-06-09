/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { DARK_THEME, GsLang, GsTheme, LANG_SYSTEM } from '@gridsuite/commons-ui';
import { getAppName } from '../../config/config-params';

export const LOCAL_STORAGE_THEME_KEY = `${getAppName()}_THEME`.toUpperCase();
const LOCAL_STORAGE_LANGUAGE_KEY = `${getAppName()}_LANGUAGE`.toUpperCase();

export function getLocalStorageTheme() {
    return (localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as GsTheme) || DARK_THEME;
}

export function saveLocalStorageTheme(theme: GsTheme): void {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
}

export function getLocalStorageLanguage() {
    return (localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY) as GsLang) || LANG_SYSTEM;
}

export function saveLocalStorageLanguage(language: GsLang): void {
    localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, language);
}

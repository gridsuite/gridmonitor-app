/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getAppName, PARAM_DEVELOPER_MODE } from '@gridsuite/commons-ui';
import { useGetParameterQuery } from 'shared/api/config-api';
import { APP_NAME } from '../../../shared/config/application';
import { Preferences, PreferencesKey } from '../store/preferences.type';
import { useStableUserProfile } from '../../authentication/hooks/use-stable-user-profile';
import { getLocalStorageLanguage, getLocalStorageTheme } from '../store/preferences.local-storage';

function parsePreferenceValue<K extends PreferencesKey>(paramName: K, rawValue: string): Preferences[K] {
    if (paramName === PARAM_DEVELOPER_MODE) {
        return (rawValue === 'true') as Preferences[K];
    }
    return rawValue as Preferences[K];
}

function getPreferencesFallbacks(): Preferences {
    return {
        language: getLocalStorageLanguage(),
        theme: getLocalStorageTheme(),
        isDeveloperMode: false,
    };
}

/**
 * This data is fetched from AppTopBar, which is displayed before user is authenticated
 * If user is not authenticated, or before the fetch request has responded, we use data from initialPreferencesState
 */
export const usePreferenceWithFallback = <K extends PreferencesKey>(paramName: K) => {
    const userProfile = useStableUserProfile();

    return useGetParameterQuery(
        { name: paramName, appName: getAppName(APP_NAME, paramName) },
        {
            skip: !userProfile,
            selectFromResult: (result) => {
                const rawData = result.data?.value;
                const data = rawData ? parsePreferenceValue(paramName, rawData) : getPreferencesFallbacks()[paramName];

                return {
                    ...result,
                    data,
                };
            },
        }
    );
};

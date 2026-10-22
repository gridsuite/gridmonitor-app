/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getAppName } from '@gridsuite/commons-ui';
import { useUpdateParameterMutation } from 'shared/api/config-api';
import { Preferences, PreferencesKey } from '../store/preferences.type';
import { usePreferenceWithFallback } from './use-preference-with-fallback';
import { APP_NAME } from '../../../shared/config/application';

export function usePreference<K extends PreferencesKey>(paramName: K) {
    const { data: paramValue } = usePreferenceWithFallback(paramName);
    const [updateConfigParameter] = useUpdateParameterMutation();

    const setValue = async (newValue: Preferences[K]) => {
        await updateConfigParameter({
            appName: getAppName(APP_NAME, paramName),
            name: paramName,
            value: String(newValue),
        }).unwrap();
    };

    return [paramValue, setValue] as const;
}

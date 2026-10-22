/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PARAM_DEVELOPER_MODE } from '@gridsuite/commons-ui';
import { Preferences, PreferencesKey } from '../../../features/preferences/store/preferences.type';

export function mapRawParamValue<K extends PreferencesKey>(paramName: K, rawValue: string): Preferences[K] {
    if (paramName === PARAM_DEVELOPER_MODE) {
        return (rawValue === 'true') as Preferences[K];
    }
    return rawValue as Preferences[K];
}

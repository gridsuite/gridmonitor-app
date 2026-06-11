/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PARAM_DEVELOPER_MODE } from '@gridsuite/commons-ui';
import { AppParameters, AppParametersKey } from 'features/app-parameters/store/app-parameters.type';

export function mapRawParamValue<K extends AppParametersKey>(paramName: K, rawValue: string): AppParameters[K] {
    if (paramName === PARAM_DEVELOPER_MODE) {
        return (rawValue === 'true') as AppParameters[K];
    }
    return rawValue as AppParameters[K];
}

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getAppName } from '@gridsuite/commons-ui';
import { APP_NAME } from 'app/config/app-config';
import { useGetParameterQuery } from 'shared/api/config-api';
import { getInitialAppParametersState } from '../store/app-parameters.default';
import { AppParametersKey } from '../store/app-parameters.type';
import { mapRawParamValue } from '../../../shared/api/config-api/config.mapping';
import { useStableUserProfile } from '../../authentication/hooks/use-stable-user-profile';

/**
 * This data is fetched from AppTopBar, which is displayed before user is authenticated
 * If user is not authenticated, or before the fetch request has responded, we use data from initialAppParametersState
 */
export const useGetConfigParameterWithFallback = <K extends AppParametersKey>(paramName: K) => {
    const userProfile = useStableUserProfile();

    return useGetParameterQuery(
        { name: paramName, appName: getAppName(APP_NAME, paramName) },
        {
            skip: !userProfile,
            selectFromResult: (result) => {
                const rawData = result.data?.value;
                const data = rawData ? mapRawParamValue(paramName, rawData) : getInitialAppParametersState()[paramName];

                return {
                    ...result,
                    data,
                };
            },
        }
    );
};

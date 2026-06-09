/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getAppName } from '@gridsuite/commons-ui';
import { APP_NAME } from 'app/config/app-config';
import { useAppSelector } from 'app/store/store';
import { selectUserProfile } from 'features/authentication/store/authentication.selectors';
import { useGetParameterQuery } from 'shared/api/config-api';
import { getInitialAppParametersState } from '../store/app-parameters.default';
import { AppParameters, AppParametersKey } from '../store/app-parameters.type';

/**
 * This data is fetched from AppTopBar, which is displayed before user is authenticated
 * If user is not authenticated, or before the fetch request has responded, we use data from initialAppParametersState
 */
export const useGetConfigParameterWithFallback = <K extends AppParametersKey>(paramName: K) => {
    const userProfile = useAppSelector(
        selectUserProfile,
        (a, b) =>
            a === b || (a?.sub === b?.sub && a?.name === b?.name && a?.email === b?.email && a?.profile === b?.profile)
    );

    return useGetParameterQuery(
        { name: paramName, appName: getAppName(APP_NAME, paramName) },
        {
            skip: !userProfile,
            selectFromResult: (result) => {
                const data = result.data?.value ?? getInitialAppParametersState()[paramName];

                return {
                    ...result,
                    data: data as AppParameters[K],
                };
            },
        }
    );
};

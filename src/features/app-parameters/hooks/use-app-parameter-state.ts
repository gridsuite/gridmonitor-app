/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getAppName as getAppNameCommons } from '@gridsuite/commons-ui';
import { AppParameters, AppParametersKey } from 'features/app-parameters/store/app-parameters.type';
import { getAppName } from 'shared/config/config-params';
import { useUpdateParameterMutation } from 'shared/api/config-api';
import { useGetConfigParameterWithFallback } from './use-get-config-parameter-with-fallback';

type UseAppParameterStateProps<K extends AppParametersKey> = {
    paramName: K;
    isAuthenticated: boolean;
};

export function useAppParameterState<K extends AppParametersKey>({
    paramName,
    isAuthenticated,
}: UseAppParameterStateProps<K>) {
    const { data: paramValue } = useGetConfigParameterWithFallback({ paramName, isAuthenticated });
    const [updateConfigParameter] = useUpdateParameterMutation();

    const setValue = async (newValue: AppParameters[K]) => {
        await updateConfigParameter({
            appName: getAppNameCommons(getAppName(), paramName),
            name: paramName,
            value: newValue,
        }).unwrap();
    };

    return [paramValue, setValue] as const;
}

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { AppParameters, AppParametersKey } from 'features/app-parameters/store/app-parameters.type';
import { useUpdateConfigParameterMutation } from 'shared/api/config-api/config-api';
import { useGetConfigParameterWithFallback } from './use-get-config-parameter-with-fallback';

export function useAppParameterState<K extends AppParametersKey>(paramName: K) {
    const { data: paramValue } = useGetConfigParameterWithFallback(paramName);
    const [updateConfigParameter] = useUpdateConfigParameterMutation();

    const setValue = async (newValue: AppParameters[K]) => {
        await updateConfigParameter({
            name: paramName,
            value: newValue,
        }).unwrap();
    };

    return [paramValue, setValue] as const;
}

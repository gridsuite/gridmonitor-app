/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getAppName as getConfigAppName, PARAM_LANGUAGE, PARAM_THEME } from '@gridsuite/commons-ui';
import { saveLocalStorageLanguage, saveLocalStorageTheme } from './config-api.local-storage';
import { configBaseApi, ConfigTags } from './config-base-api';
import { ConfigParameter, UpdateConfigParameterRequest } from './config-api.type';
import { AnyAppDispatch } from '../../store/state.type';
import { getAppName } from '../../config/config-params';

const CONFIG_URL = `/v1`;

const makeConfigUrl = (path: string) => `${CONFIG_URL}${path}`;

export const configApi = configBaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getConfigParameter: builder.query<ConfigParameter, string>({
            query: (name) => {
                const appName = getConfigAppName(getAppName(), name);
                return makeConfigUrl(`/applications/${appName}/parameters/${name}`);
            },
            providesTags: (result, error, paramName) => [{ type: ConfigTags.Parameters, id: paramName }],
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    switch (data.name) {
                        case PARAM_LANGUAGE:
                            saveLocalStorageLanguage(data.value);
                            break;
                        case PARAM_THEME:
                            saveLocalStorageTheme(data.value);
                            break;
                        default:
                            // should not happen
                            break;
                    }
                } catch (error) {
                    console.debug('getConfigParameter RTK query failed (ignored here)', error);
                }
            },
        }),
        updateConfigParameter: builder.mutation<void, UpdateConfigParameterRequest>({
            query: ({ name, value }) => {
                const appName = getConfigAppName(getAppName(), name);
                return {
                    url: makeConfigUrl(
                        `/applications/${appName}/parameters/${name}?value=${encodeURIComponent(value)}`
                    ),
                    method: 'PUT',
                };
            },
            async onQueryStarted({ name, value }, { dispatch, queryFulfilled }) {
                const patch = dispatch(
                    configApi.util.updateQueryData('getConfigParameter', name, (draft) => {
                        if (draft) {
                            draft.value = value;
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patch.undo();
                }
            },
        }),
    }),
});

export const invalidateConfigQueries = (dispatch: AnyAppDispatch, paramName: string) => {
    dispatch(configApi.util.invalidateTags([{ type: ConfigTags.Parameters, id: paramName }]));
};

export const { useGetConfigParameterQuery, useUpdateConfigParameterMutation } = configApi;

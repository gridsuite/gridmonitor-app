/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { GsLang, GsTheme, PARAM_LANGUAGE, PARAM_THEME, getAppName } from '@gridsuite/commons-ui';
import { APP_NAME } from 'app/config/app-config';
import { AppDispatch } from 'app/store/store';
import { AppParameters, AppParametersKey } from 'features/app-parameters/store/app-parameters.type';
import {
    saveLocalStorageLanguage,
    saveLocalStorageTheme,
} from 'features/app-parameters/store/app-parameters.local-storage';
import { ApiTags, baseApi } from '../rtk-query/base-api';

const CONFIG_URL = `/config/v1`;

const makeConfigUrl = (path: string) => `${CONFIG_URL}${path}`;

export const configApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getConfigParameter: builder.query<ConfigParameter, string>({
            query: (name) => {
                const appName = getAppName(APP_NAME, name);
                return makeConfigUrl(`/applications/${appName}/parameters/${name}`);
            },
            providesTags: (result, error, paramName) => [{ type: ApiTags.Config, id: paramName }],
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
                const appName = getAppName(APP_NAME, name);
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

export const invalidateConfigQueries = (dispatch: AppDispatch, paramName: string) => {
    dispatch(baseApi.util.invalidateTags([{ type: ApiTags.Config, id: paramName }]));
};

// https://github.com/gridsuite/config-server/blob/main/src/main/java/org/gridsuite/config/server/dto/ParameterInfos.java
export type ConfigParameter =
    | {
          readonly name: typeof PARAM_LANGUAGE;
          value: GsLang;
      }
    | {
          readonly name: typeof PARAM_THEME;
          value: GsTheme;
      };
export type UpdateConfigParameterRequest = {
    name: AppParametersKey;
    value: AppParameters[AppParametersKey];
};

export const { useGetConfigParameterQuery, useUpdateConfigParameterMutation } = configApi;

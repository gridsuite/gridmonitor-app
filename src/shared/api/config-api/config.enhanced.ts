/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { GsLang, GsTheme, PARAM_LANGUAGE, PARAM_THEME } from '@gridsuite/commons-ui';
import type { AppDispatch } from 'app/store/store';
import {
    saveLocalStorageLanguage,
    saveLocalStorageTheme,
} from 'features/app-parameters/store/app-parameters.local-storage';
import { ConfigTags } from './config-base-api';
import { configGeneratedApi } from './config.generated';

export const configApi = configGeneratedApi.enhanceEndpoints({
    endpoints: {
        getParameter: {
            providesTags: (result, error, params) => [{ type: ConfigTags.Parameters, id: params.name }],
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    switch (data.name) {
                        case PARAM_LANGUAGE:
                            saveLocalStorageLanguage(data.value as GsLang); // TODO: fix with actual check ?
                            break;
                        case PARAM_THEME:
                            saveLocalStorageTheme(data.value as GsTheme); // TODO: fix with actual check ?
                            break;
                        default:
                            // should not happen
                            break;
                    }
                } catch (error) {
                    console.debug('getConfigParameter RTK query failed (ignored here)', error);
                }
            },
        },
        updateParameter: {
            async onQueryStarted(params, { dispatch, queryFulfilled }) {
                const patch = dispatch(
                    configApi.util.updateQueryData(
                        'getParameter',
                        { name: params.name, appName: params.appName },
                        (draft) => {
                            if (draft) {
                                draft.value = params.value;
                            }
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    patch.undo();
                }
            },
        },
    },
});

export const invalidateConfigQueries = (dispatch: AppDispatch, paramName: string) => {
    dispatch(configApi.util.invalidateTags([{ type: ConfigTags.Parameters, id: paramName }]));
};

export const { useGetParameterQuery, useUpdateParameterMutation } = configApi;

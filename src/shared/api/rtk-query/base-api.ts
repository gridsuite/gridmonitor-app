/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { FetchArgs } from '@reduxjs/toolkit/query';
import type { RootState } from '../../../app/store/store';

type ResponseHandler = 'json' | 'text' | 'content-type' | ((response: Response) => Promise<unknown>);

export const createBaseQuery = (baseUrl: string, responseHandlers: Record<string, ResponseHandler> = {}) => {
    const baseQuery = fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as RootState;

            const token = state?.authentication?.user?.id_token;

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    });

    return (
        args: string | FetchArgs,
        api: Parameters<typeof baseQuery>[1],
        extraOptions: Parameters<typeof baseQuery>[2]
    ) => {
        const responseHandler = responseHandlers[api.endpoint];
        const queryArgs =
            responseHandler && typeof args === 'object' && args !== null ? { ...args, responseHandler } : args;

        return baseQuery(queryArgs, api, extraOptions);
    };
};

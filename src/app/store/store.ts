/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { errorMiddleware } from 'shared/store/rtk-query-error-middleware';
import { monitorApi } from 'shared/api/monitor-api';
import { studyApi } from 'shared/api/study-api/study-api';
import { configApi } from 'shared/api/config-api/config-api';
import { updateConfigParams } from 'shared/config/config-params';
import { reducer } from './reducer';

export const setupStore = (preloadedState?: PreloadedState) =>
    configureStore({
        reducer,
        preloadedState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredPaths: ['authentication.user'],
                },
            })
                .prepend(errorMiddleware)
                .concat(monitorApi.middleware, studyApi.middleware, configApi.middleware),
    });

export const store = setupStore();
// push store to configParams to be able to access it in the token selector at low-level module
updateConfigParams({ store });

export type PreloadedState = Parameters<typeof reducer>[0];
export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

if (import.meta.env.DEV && import.meta.hot) {
    import.meta.hot.accept('./reducer', () => {
        store.replaceReducer(reducer);
    });
}

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from 'shared/api/rtk-query/base-api';
import { useDispatch, useSelector } from 'react-redux';
import { reducer } from './reducer';
import { errorMiddleware } from './rtk-query-error-middleware';

export const setupStore = (preloadedState?: PreloadedState) =>
    configureStore({
        reducer,
        preloadedState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().prepend(errorMiddleware).concat(baseApi.middleware),
    });

export const store = setupStore();

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

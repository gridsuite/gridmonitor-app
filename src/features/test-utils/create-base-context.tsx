/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { errorMiddleware } from 'shared/store/rtk-query-error-middleware';
import { monitorApi } from 'shared/api/monitor-api';
import { studyApi } from 'shared/api/study-api/study-api';
import { configApi } from 'shared/api/config-api/config-api';

export const createBaseContext = () => {
    const store = configureStore({
        reducer: {
            [monitorApi.reducerPath]: monitorApi.reducer,
            [configApi.reducerPath]: configApi.reducer,
            [studyApi.reducerPath]: studyApi.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .prepend(errorMiddleware)
                .concat(monitorApi.middleware, studyApi.middleware, configApi.middleware),
    });
    const wrapper = ({ children }: PropsWithChildren) => <Provider store={store}>{children}</Provider>;
    return { store, wrapper };
};

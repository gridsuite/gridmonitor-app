/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { combineReducers } from '@reduxjs/toolkit';
import { authenticationReducer } from 'features/authentication/store/authentication.slice';
import { configApi } from 'shared/api/config-api';
import { studyApi } from 'shared/api/study-api';
import { monitorApi } from 'shared/api/monitor-api';

export const reducer = combineReducers({
    authentication: authenticationReducer,
    [monitorApi.reducerPath]: monitorApi.reducer,
    [configApi.reducerPath]: configApi.reducer,
    [studyApi.reducerPath]: studyApi.reducer,
});

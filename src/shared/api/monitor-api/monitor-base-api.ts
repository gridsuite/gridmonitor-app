/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../rtk-query/base-api';

export const MonitorTags = {
    ProcessExecutions: 'ProcessExecutions',
} as const;

export const monitorBaseApi = createApi({
    reducerPath: 'monitorApi',
    baseQuery: createBaseQuery(`${import.meta.env.VITE_API_GATEWAY}/monitor`),
    tagTypes: Object.values(MonitorTags),
    endpoints: () => ({}),
});

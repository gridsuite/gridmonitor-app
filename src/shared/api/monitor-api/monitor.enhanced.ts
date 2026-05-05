/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { monitorGeneratedApi } from './monitor.generated';
import { MonitorTags } from './monitor-base-api';
import type { AppDispatch } from '../../../app/store/store';

export const monitorApi = monitorGeneratedApi.enhanceEndpoints({
    endpoints: {
        getLaunchedProcesses: {
            providesTags: [{ type: MonitorTags.ProcessExecutions, id: 'LIST' }],
        },
    },
});

export const invalidateProcessExecutionsLists = (dispatch: AppDispatch) =>
    dispatch(monitorApi.util.invalidateTags([{ type: MonitorTags.ProcessExecutions, id: 'LIST' }]));

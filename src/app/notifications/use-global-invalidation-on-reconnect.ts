/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useNotificationsListener, NotificationsUrlKeys } from '@gridsuite/commons-ui';
import { useAppDispatch } from 'app/store/hooks';
import { invalidateAllQueries as invalidateAllConfigQueries } from 'shared/api/config-api';
import { invalidateAllQueries as invalidateAllMonitorQueries } from 'shared/api/monitor-api';

/**
 * On WebSocket disconnection, invalidate only tagged RTK queries associated
 * with that WebSocket (config or monitor), as backend notifications may have been missed.
 * Untagged queries are excluded since they don't rely on WebSocket notifications.
 * Update this mapping if a new WebSocket URL is added.
 */
export const useGlobalInvalidationListener = () => {
    const dispatch = useAppDispatch();

    useNotificationsListener(NotificationsUrlKeys.CONFIG, {
        listenerCallbackOnReopen: () => invalidateAllConfigQueries(dispatch),
    });

    useNotificationsListener(NotificationsUrlKeys.MONITOR, {
        listenerCallbackOnReopen: () => invalidateAllMonitorQueries(dispatch),
    });
};

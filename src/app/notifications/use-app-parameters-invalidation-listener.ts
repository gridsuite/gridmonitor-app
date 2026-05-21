/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { NotificationsUrlKeys, useNotificationsListener } from '@gridsuite/commons-ui';
import { invalidateConfigQueries } from 'shared/api/config-api';
import { useAppDispatch } from '../store/store';

type ConfigNotificationData = {
    headers?: {
        parameterName?: string;
    };
};

export const useAppParametersInvalidationListener = () => {
    const dispatch = useAppDispatch();

    const invalidateAppParameter = (event: MessageEvent) => {
        const eventData = JSON.parse(event.data) as ConfigNotificationData;
        if (eventData.headers?.parameterName) {
            invalidateConfigQueries(dispatch, eventData.headers.parameterName);
        }
    };

    useNotificationsListener(NotificationsUrlKeys.CONFIG, {
        listenerCallbackMessage: invalidateAppParameter,
    });
};

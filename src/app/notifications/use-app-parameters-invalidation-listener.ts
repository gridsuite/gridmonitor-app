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

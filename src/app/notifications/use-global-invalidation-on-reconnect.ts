import { useNotificationsListener, NotificationsUrlKeys } from '@gridsuite/commons-ui';
import { useAppDispatch } from 'app/store/hooks';
import { invalidateAllQueries as invalidateAllConfigQueries } from 'shared/api/config-api';
import { invalidateAllQueries as invalidateAllMonitorQueries } from 'shared/api/monitor-api';
import { invalidateAllQueries as invalidateAllStudyQueries } from 'shared/api/study-api';
import { invalidateAllQueries as invalidateAllExploreQueries } from 'shared/api/explore-api';

/**
 * To complete if this app starts to listen to another websocket URL
 * Invalidate all RTK queries states if any websocket disconnects
 */
export const useGlobalInvalidationListener = () => {
    const dispatch = useAppDispatch();

    const invalidateAllQueries = () => {
        console.log('DISCONNECTED');
        invalidateAllConfigQueries(dispatch);
        invalidateAllMonitorQueries(dispatch);
        invalidateAllStudyQueries(dispatch);
        invalidateAllExploreQueries(dispatch);
    };

    useNotificationsListener(NotificationsUrlKeys.CONFIG, {
        listenerCallbackOnReopen: invalidateAllQueries,
    });

    useNotificationsListener(NotificationsUrlKeys.MONITOR, {
        listenerCallbackMessage: (event) => console.log('CONNECTED', event),
        listenerCallbackOnReopen: invalidateAllQueries,
    });
};

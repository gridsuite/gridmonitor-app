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

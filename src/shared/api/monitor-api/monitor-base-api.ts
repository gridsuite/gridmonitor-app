import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../rtk-query/base-api';

export const monitorBaseApi = createApi({
    reducerPath: 'monitorApi',
    baseQuery: createBaseQuery(`${import.meta.env.VITE_API_GATEWAY}/monitor`),
    endpoints: () => ({}),
});

import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../rtk-query/base-api';

export const studyBaseApi = createApi({
    reducerPath: 'studyApi',
    baseQuery: createBaseQuery(`${import.meta.env.VITE_API_GATEWAY}/study`),
    endpoints: () => ({}),
});

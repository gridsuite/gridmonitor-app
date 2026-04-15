import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../rtk-query/base-api';

export const ConfigTags = {
    Parameters: 'Parameters',
} as const;

export const configBaseApi = createApi({
    reducerPath: 'configApi',
    baseQuery: createBaseQuery(`${import.meta.env.VITE_API_GATEWAY}/config`),
    tagTypes: Object.values(ConfigTags),
    endpoints: () => ({}),
});

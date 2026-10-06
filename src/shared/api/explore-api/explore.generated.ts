import { exploreBaseApi as api } from "shared/api/explore-api/explore-base-api";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    createProcessConfig: build.mutation<
      CreateProcessConfigApiResponse,
      CreateProcessConfigApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/explore/process-configs`,
        method: "POST",
        body: queryArg.body,
        params: {
          name: queryArg.name,
          description: queryArg.description,
          parentDirectoryUuid: queryArg.parentDirectoryUuid,
        },
      }),
    }),
    getElementsName: build.query<
      GetElementsNameApiResponse,
      GetElementsNameApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/explore/elements/name`,
        params: {
          ids: queryArg.ids,
        },
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as exploreGeneratedApi };
export type CreateProcessConfigApiResponse =
  /** status 200 Process config has been successfully created */ string;
export type CreateProcessConfigApiArg = {
  name: string;
  description: string;
  parentDirectoryUuid: string;
  body: string;
};
export type GetElementsNameApiResponse = /** status 200 The elements names */ {
  [key: string]: string;
};
export type GetElementsNameApiArg = {
  ids: string[];
};
export const { useCreateProcessConfigMutation, useGetElementsNameQuery } =
  injectedRtkApi;

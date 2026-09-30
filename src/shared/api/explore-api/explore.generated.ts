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
export const { useCreateProcessConfigMutation } = injectedRtkApi;

import { exploreBaseApi as api } from "shared/api/explore-api/explore-base-api";
import { ProcessConfig } from "../monitor-api";
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
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
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
  body: ProcessConfig;
};
export const { useCreateProcessConfigMutation } = injectedRtkApi;

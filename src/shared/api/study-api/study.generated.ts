import { studyBaseApi as api } from "shared/api/study-api/study-base-api";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSuiteAboutInformation: build.query<
      GetSuiteAboutInformationApiResponse,
      GetSuiteAboutInformationApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/servers/about`,
        params: {
          view: queryArg.view,
        },
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as studyGeneratedApi };
export type GetSuiteAboutInformationApiResponse =
  /** status 200 The information on all known servers */
    | AboutInfo[]
    | /** status 207 Partial result because some servers haven't responded or threw an error */ AboutInfo[];
export type GetSuiteAboutInformationApiArg = {
  /** The view which will be used to filter the returned services */
  view?: "EXPLORE" | "STUDY" | "MERGE" | "DYNA" | "ADMIN";
};
export type AboutInfo = {
  type?: Type;
  name?: string;
  version?: string;
  gitTag?: string;
};
export enum Type {
  Apps = "apps",
  Server = "server",
  Other = "other",
}
export const { useGetSuiteAboutInformationQuery } = injectedRtkApi;

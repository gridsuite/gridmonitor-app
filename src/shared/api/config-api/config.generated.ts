import { configBaseApi as api } from "shared/api/config-api/config-base-api";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getParameter: build.query<GetParameterApiResponse, GetParameterApiArg>({
      query: (queryArg) => ({
        url: `/v1/applications/${queryArg.appName}/parameters/${queryArg.name}`,
      }),
    }),
    updateParameter: build.mutation<
      UpdateParameterApiResponse,
      UpdateParameterApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/applications/${queryArg.appName}/parameters/${queryArg.name}`,
        method: "PUT",
        params: {
          value: queryArg.value,
        },
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as configGeneratedApi };
export type GetParameterApiResponse =
  /** status 200 The configuration parameter for the application */ ParameterInfos;
export type GetParameterApiArg = {
  appName: string;
  name: string;
};
export type UpdateParameterApiResponse = unknown;
export type UpdateParameterApiArg = {
  appName: string;
  name: string;
  value: string;
};
export type ParameterInfos = {
  name?: string;
  value?: string;
};
export const { useGetParameterQuery, useUpdateParameterMutation } =
  injectedRtkApi;

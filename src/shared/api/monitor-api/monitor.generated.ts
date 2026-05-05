import { monitorBaseApi as api } from "shared/api/monitor-api/monitor-base-api";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProcessConfig: build.query<
      GetProcessConfigApiResponse,
      GetProcessConfigApiArg
    >({
      query: (queryArg) => ({ url: `/v1/process-configs/${queryArg.uuid}` }),
    }),
    updateProcessConfig: build.mutation<
      UpdateProcessConfigApiResponse,
      UpdateProcessConfigApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/process-configs/${queryArg.uuid}`,
        method: "PUT",
        body: queryArg.body,
      }),
    }),
    deleteProcessConfig: build.mutation<
      DeleteProcessConfigApiResponse,
      DeleteProcessConfigApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/process-configs/${queryArg.uuid}`,
        method: "DELETE",
      }),
    }),
    getProcessConfigs: build.query<
      GetProcessConfigsApiResponse,
      GetProcessConfigsApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/process-configs`,
        params: {
          processType: queryArg.processType,
        },
      }),
    }),
    createProcessConfig: build.mutation<
      CreateProcessConfigApiResponse,
      CreateProcessConfigApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/process-configs`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    duplicateProcessConfig: build.mutation<
      DuplicateProcessConfigApiResponse,
      DuplicateProcessConfigApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/process-configs/duplication`,
        method: "POST",
        params: {
          duplicateFrom: queryArg.duplicateFrom,
        },
      }),
    }),
    executeProcess: build.mutation<
      ExecuteProcessApiResponse,
      ExecuteProcessApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/execute`,
        method: "POST",
        params: {
          caseUuid: queryArg.caseUuid,
          processConfigUuid: queryArg.processConfigUuid,
          isDebug: queryArg.isDebug,
        },
      }),
    }),
    getProcessConfigsMetadata: build.query<
      GetProcessConfigsMetadataApiResponse,
      GetProcessConfigsMetadataApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/process-configs/metadata`,
        params: {
          ids: queryArg.ids,
        },
      }),
    }),
    compareProcessConfigs: build.query<
      CompareProcessConfigsApiResponse,
      CompareProcessConfigsApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/process-configs/compare`,
        params: {
          uuid1: queryArg.uuid1,
          uuid2: queryArg.uuid2,
        },
      }),
    }),
    getLaunchedProcesses: build.query<
      GetLaunchedProcessesApiResponse,
      GetLaunchedProcessesApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/executions`,
        params: {
          processType: queryArg.processType,
        },
      }),
    }),
    getStepsInfos: build.query<GetStepsInfosApiResponse, GetStepsInfosApiArg>({
      query: (queryArg) => ({
        url: `/v1/executions/${queryArg.executionId}/step-infos`,
      }),
    }),
    getExecutionResults: build.query<
      GetExecutionResultsApiResponse,
      GetExecutionResultsApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/executions/${queryArg.executionId}/results`,
      }),
    }),
    getExecutionReports: build.query<
      GetExecutionReportsApiResponse,
      GetExecutionReportsApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/executions/${queryArg.executionId}/reports`,
      }),
    }),
    getDebugInfos: build.query<GetDebugInfosApiResponse, GetDebugInfosApiArg>({
      query: (queryArg) => ({
        url: `/v1/executions/${queryArg.executionId}/debug-infos`,
      }),
    }),
    deleteExecution: build.mutation<
      DeleteExecutionApiResponse,
      DeleteExecutionApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/executions/${queryArg.executionId}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as monitorGeneratedApi };
export type GetProcessConfigApiResponse =
  /** status 200 process config was returned */ PersistedProcessConfig;
export type GetProcessConfigApiArg = {
  /** process config UUID */
  uuid: string;
};
export type UpdateProcessConfigApiResponse = unknown;
export type UpdateProcessConfigApiArg = {
  /** process config UUID */
  uuid: string;
  body: LoadFlowConfig | SecurityAnalysisConfig;
};
export type DeleteProcessConfigApiResponse = unknown;
export type DeleteProcessConfigApiArg = {
  /** process config UUID */
  uuid: string;
};
export type GetProcessConfigsApiResponse =
  /** status 200 The process configs of the given type were returned */ PersistedProcessConfig[];
export type GetProcessConfigsApiArg = {
  /** Process type */
  processType: ProcessType;
};
export type CreateProcessConfigApiResponse =
  /** status 200 process config was created */ string;
export type CreateProcessConfigApiArg = {
  body: LoadFlowConfig | SecurityAnalysisConfig;
};
export type DuplicateProcessConfigApiResponse =
  /** status 200 process config was duplicated */ string;
export type DuplicateProcessConfigApiArg = {
  /** UUID of the process config to duplicate */
  duplicateFrom: string;
};
export type ExecuteProcessApiResponse =
  /** status 200 The process execution has been started */ string;
export type ExecuteProcessApiArg = {
  /** Case uuid */
  caseUuid: string;
  /** Process config uuid */
  processConfigUuid: string;
  isDebug?: boolean;
};
export type GetProcessConfigsMetadataApiResponse =
  /** status 200 process configs metadata were returned */ MetadataInfos[];
export type GetProcessConfigsMetadataApiArg = {
  ids: string[];
};
export type CompareProcessConfigsApiResponse =
  /** status 200 Comparison result returned */ ProcessConfigComparison;
export type CompareProcessConfigsApiArg = {
  /** First process config UUID */
  uuid1: string;
  /** Second process config UUID */
  uuid2: string;
};
export type GetLaunchedProcessesApiResponse =
  /** status 200 The launched processes */ ProcessExecution[];
export type GetLaunchedProcessesApiArg = {
  /** Process type */
  processType: ProcessType;
};
export type GetStepsInfosApiResponse =
  /** status 200 The execution steps statuses */ ProcessExecutionStep[];
export type GetStepsInfosApiArg = {
  /** Execution UUID */
  executionId: string;
};
export type GetExecutionResultsApiResponse =
  /** status 200 The execution results */ string[];
export type GetExecutionResultsApiArg = {
  /** Execution UUID */
  executionId: string;
};
export type GetExecutionReportsApiResponse =
  /** status 200 The execution reports */ ReportPage[];
export type GetExecutionReportsApiArg = {
  /** Execution UUID */
  executionId: string;
};
export type GetDebugInfosApiResponse =
  /** status 200 Debug file downloaded */ string;
export type GetDebugInfosApiArg = {
  /** Execution UUID */
  executionId: string;
};
export type DeleteExecutionApiResponse = unknown;
export type DeleteExecutionApiArg = {
  executionId: string;
};
export type ProcessConfigBase = {
  processType: string;
};
export type LoadFlowConfig = {
  processType: "LoadFlowConfig";
} & ProcessConfigBase & {
    loadflowParametersUuid: string;
    modificationUuids: string[];
  };
export type SecurityAnalysisConfig = {
  processType: "SecurityAnalysisConfig";
} & ProcessConfigBase & {
    securityAnalysisParametersUuid: string;
    modificationUuids: string[];
    loadflowParametersUuid: string;
  };
export type PersistedProcessConfig = {
  id?: string;
  processConfig?: LoadFlowConfig | SecurityAnalysisConfig;
};
export type MetadataInfos = {
  id?: string;
  type?: ProcessType;
};
export type ProcessConfigFieldComparison = {
  field?: string;
  identical?: boolean;
  value1?: any;
  value2?: any;
};
export type ProcessConfigComparison = {
  processConfigUuid1?: string;
  processConfigUuid2?: string;
  identical?: boolean;
  differences?: ProcessConfigFieldComparison[];
};
export type ProcessExecution = {
  id: string;
  type: string;
  caseUuid: string;
  processConfigId: string;
  status: ProcessStatus;
  executionEnvName: string;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  userId: string;
};
export type ProcessExecutionStep = {
  id: string;
  stepType: string;
  stepOrder: number;
  status: StepStatus;
  resultId?: string;
  resultType?: ResultType;
  reportId?: string;
  startedAt?: string;
  completedAt?: string;
};
export type ReportLog = {
  message?: string;
  severity?: Severity;
  depth?: number;
  parentId?: string;
};
export type ReportPage = {
  number?: number;
  content?: ReportLog[];
  totalElements?: number;
  totalPages?: number;
};
export enum ProcessType {
  SecurityAnalysis = "SECURITY_ANALYSIS",
  Loadflow = "LOADFLOW",
}
export enum ProcessStatus {
  Scheduled = "SCHEDULED",
  Running = "RUNNING",
  Completed = "COMPLETED",
  Failed = "FAILED",
}
export enum StepStatus {
  Scheduled = "SCHEDULED",
  Running = "RUNNING",
  Completed = "COMPLETED",
  Failed = "FAILED",
  Skipped = "SKIPPED",
}
export enum ResultType {
  SecurityAnalysis = "SECURITY_ANALYSIS",
  Loadflow = "LOADFLOW",
}
export enum Severity {
  Unknown = "UNKNOWN",
  Trace = "TRACE",
  Debug = "DEBUG",
  Detail = "DETAIL",
  Info = "INFO",
  Warn = "WARN",
  Error = "ERROR",
  Fatal = "FATAL",
}
export const {
  useGetProcessConfigQuery,
  useUpdateProcessConfigMutation,
  useDeleteProcessConfigMutation,
  useGetProcessConfigsQuery,
  useCreateProcessConfigMutation,
  useDuplicateProcessConfigMutation,
  useExecuteProcessMutation,
  useGetProcessConfigsMetadataQuery,
  useCompareProcessConfigsQuery,
  useGetLaunchedProcessesQuery,
  useGetStepsInfosQuery,
  useGetExecutionResultsQuery,
  useGetExecutionReportsQuery,
  useGetDebugInfosQuery,
  useDeleteExecutionMutation,
} = injectedRtkApi;

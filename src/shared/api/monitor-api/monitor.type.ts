import {
    LoadFlowConfig as RawLoadFlowConfig,
    ProcessType,
    SecurityAnalysisConfig as RawSecurityAnalysisConfig,
} from './monitor.generated';

export type LoadFlowConfig = Omit<RawLoadFlowConfig, 'processType'> & {
    processType: ProcessType.Loadflow;
};

export type SecurityAnalysisConfig = Omit<RawSecurityAnalysisConfig, 'processType'> & {
    processType: ProcessType.SecurityAnalysis;
};

export type ProcessConfig = LoadFlowConfig | SecurityAnalysisConfig;

export type PersistedProcessConfig = {
    id?: string;
    processConfig?: ProcessConfig;
};

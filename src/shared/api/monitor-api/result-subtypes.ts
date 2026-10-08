export const SECURITY_ANALYSIS_RESULT_TYPES = {
    NmkContingencies: 'NMK_CONTINGENCIES',
    NmkLimitViolations: 'NMK_LIMIT_VIOLATIONS',
    NmkCutOffPower: 'NMK_CUT_OFF_POWER',
} as const;

export type SecurityAnalysisResultType =
    (typeof SECURITY_ANALYSIS_RESULT_TYPES)[keyof typeof SECURITY_ANALYSIS_RESULT_TYPES];

export const SHORT_CIRCUIT_RESULT_TYPES = {
    AllBuses: 'ALL_BUSES',
    OneBus: 'ONE_BUS',
} as const;

export type ShortCircuitResultType = (typeof SHORT_CIRCUIT_RESULT_TYPES)[keyof typeof SHORT_CIRCUIT_RESULT_TYPES];

export type MonitorResultSubtype = SecurityAnalysisResultType | ShortCircuitResultType | string;

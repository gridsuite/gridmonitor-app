export const PROCESS_PATHS = {
    root: '/process',
    execute: '/process/execute',
    results: '/process/results',
    stepInfos: (id: string) => `/process/results/${id}/step-infos`,
} as const;

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

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

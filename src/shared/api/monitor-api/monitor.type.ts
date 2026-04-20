/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

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

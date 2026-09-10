/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldConstants, ProcessType } from '@gridsuite/commons-ui';
import type { CreateProcessConfigFormValues } from '../types/processConfig.types';

export const PROCESS_CONFIG_TYPES = [
    { id: ProcessType.SECURITY_ANALYSIS, label: 'process_config/securityAnalysis' },
    { id: ProcessType.LOADFLOW, label: 'process_config/loadflow' },
    { id: ProcessType.SHORT_CIRCUIT, label: 'process_config/shortcircuit' },
] as const;

export const createProcessConfigFormDefaultValues = {
    processType: '',
    [FieldConstants.NAME]: '',
    [FieldConstants.DESCRIPTION]: '',
    [FieldConstants.DIRECTORY]: { directoryItemId: '', directoryItemFullPath: '' },
    [FieldConstants.MODIFICATIONS]: [],
    [FieldConstants.LOADFLOW_PARAMETERS]: [],
    [FieldConstants.SECURITY_ANALYSIS_PARAMETERS]: [],
    [FieldConstants.SHORTCIRCUIT_PARAMETERS]: [],
} satisfies CreateProcessConfigFormValues;

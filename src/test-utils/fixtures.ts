/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldConstants, ProcessType, type ProcessConfigFormValues } from '@gridsuite/commons-ui';
import type { ExecuteProcessConfigFormData } from 'features/process/execute/components/ExecuteProcessConfigDialog';

export function processConfigValues(overrides: Partial<ProcessConfigFormValues> = {}): ProcessConfigFormValues {
    return {
        processType: ProcessType.LOADFLOW,
        name: 'Loadflow',
        description: 'A configuration for testing',
        directory: { directoryItemId: 'directory-1', directoryItemFullPath: '/Configurations' },
        [FieldConstants.MODIFICATIONS]: [],
        [FieldConstants.LOADFLOW_PARAMETERS]: [{ id: 'parameters-1', name: 'Default parameters' }],
        ...overrides,
    };
}

export function executionValues(overrides: Partial<ExecuteProcessConfigFormData> = {}): ExecuteProcessConfigFormData {
    return {
        processType: ProcessType.LOADFLOW,
        debugMode: false,
        configSource: 'configurations',
        processConfig: [{ id: 'config-1', name: 'Loadflow' }],
        caseSource: 'gridExplore',
        case: [{ id: 'case-1', name: 'Network case' }],
        ...overrides,
    };
}

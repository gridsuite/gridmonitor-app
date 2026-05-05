/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { ConfigFile } from '@rtk-query/codegen-openapi';
import { gatewayManagedHeaderOverrides } from '../gateway-managed-header-overrides';

const config: ConfigFile = {
    schemaFile: 'codegen/monitor-api/api-docs.json',
    apiFile: 'shared/api/monitor-api/monitor-base-api.ts',
    apiImport: 'monitorBaseApi',
    outputFile: 'src/shared/api/monitor-api/monitor.generated.ts',
    exportName: 'monitorGeneratedApi',
    hooks: true,
    useEnumType: true,
    endpointOverrides: gatewayManagedHeaderOverrides,
};

export default config;

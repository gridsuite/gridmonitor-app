/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { ConfigFile } from '@rtk-query/codegen-openapi';
import { gatewayManagedHeaderOverrides } from '../gateway-managed-header-overrides';

const config: ConfigFile = {
    schemaFile: 'codegen/explore-api/api-docs.json',
    apiFile: 'shared/api/explore-api/explore-base-api.ts',
    apiImport: 'exploreBaseApi',
    outputFile: 'src/shared/api/explore-api/explore.generated.ts',
    exportName: 'exploreGeneratedApi',
    hooks: true,
    useEnumType: true,
    filterEndpoints: ['createProcessConfig'],
    endpointOverrides: gatewayManagedHeaderOverrides,
};

export default config;

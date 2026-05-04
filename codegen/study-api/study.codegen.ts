/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { ConfigFile } from '@rtk-query/codegen-openapi';
import { gatewayManagedHeaderOverrides } from '../gateway-managed-header-overrides';

const config: ConfigFile = {
    schemaFile: 'codegen/study-api/api-docs.json',
    apiFile: 'shared/api/study-api/study-base-api.ts',
    apiImport: 'studyBaseApi',
    outputFile: 'src/shared/api/study-api/study.generated.ts',
    exportName: 'studyGeneratedApi',
    hooks: true,
    useEnumType: true,
    filterEndpoints: ['getSuiteAboutInformation'],
    endpointOverrides: gatewayManagedHeaderOverrides,
};

export default config;

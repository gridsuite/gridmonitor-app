/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { generateEndpoints } from '@rtk-query/codegen-openapi';
import monitorConfig from './monitor-api/monitor.codegen';
import configConfig from './config-api/config.codegen';
import studyConfig from './study-api/study.codegen';

const configFile = [monitorConfig, studyConfig, configConfig];

async function run() {
    for (const config of configFile) {
        await generateEndpoints(config);
    }
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});

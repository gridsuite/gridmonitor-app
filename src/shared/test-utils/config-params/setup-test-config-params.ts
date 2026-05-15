/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createTestConfigParams } from './create-test-config-params';
// side-effect module to import before run test
// It gives the same guarantee as importing app/config/app-config.ts in AppProvider.tsx before store/providers created
createTestConfigParams();

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { vi } from 'vitest';
import '@testing-library/jest-dom';
import './src/shared/test-utils/msw/setup-msw';
import { createTestConfigParams } from './src/shared/test-utils/create-test-config-params';

// ConfigParams is a module-level singleton, so we need to create it only once here before any module side-effect
// It gives the same guarantee as importing app/config/app-config.ts in AppProvider.tsx before store/providers created
createTestConfigParams();

// TODO: Temporary workaround for Vitest + MUI v6 incompatibilities in tests.
// Avoids loading MUI during test execution.
// Remove after upgrading to MUI v7 or applying a proper fix.
// See: https://github.com/mui/material-ui/issues/45599
vi.mock('@gridsuite/commons-ui', async () => import('./src/test-utils/mocks/gridsuite-commons-ui'));

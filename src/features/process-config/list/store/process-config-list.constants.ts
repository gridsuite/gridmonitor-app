/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { TableType } from '@gridsuite/commons-ui';

// TODO: fix this, I think commons-ui should not be aware of all local states of all apps. Maybe change TableType by simple string ?
export const PROCESS_CONFIG_LIST = 'processConfigList' as unknown as TableType;
export const PROCESS_CONFIG_ACTIVE = 'processConfigActive';
export const PROCESS_CONFIG_HISTORY = 'processConfigHistory';

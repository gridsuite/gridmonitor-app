/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Report, SeverityLevel } from '@gridsuite/commons-ui';

export const executionFixture = (overrides?: any) => ({
    id: 'execution-1',
    status: 'RUNNING',
    type: 'PROCESS_1',
    ...overrides,
});

export const reportFixture = (overrides?: Partial<Report>): Report => ({
    id: 'report-1',
    parentId: '',
    message: 'Global',
    severity: 'INFO',
    depth: 0,
    subReports: [],
    ...overrides,
});

export const severitiesFixture = (overrides?: SeverityLevel[]): SeverityLevel[] =>
    overrides ?? ['INFO', 'WARNING', 'ERROR'];

export const pagedLogsFixture = (overrides?: any) => ({
    content: [],
    totalElements: 0,
    totalPages: 0,
    ...overrides,
});

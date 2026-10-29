/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { lazy } from 'react';
import { Navigate, Route } from 'react-router';

const ProcessExecutionListPage = lazy(() => import('../../pages/process-execution/ProcessExecutionListPage'));
const ProcessExecutionDetailsPage = lazy(() => import('../../pages/process-execution/ProcessExecutionDetailsPage'));
const ProcessExecutionLogsPage = lazy(() => import('../../pages/process-execution/ProcessExecutionLogsPage'));

export const processRoutes = (
    <Route path="process">
        <Route index element={<Navigate to="results" replace />} />
        <Route path="results">
            <Route index element={<ProcessExecutionListPage />} />
            <Route path=":id">
                <Route index element={<ProcessExecutionDetailsPage />} />
                <Route path="logs" element={<ProcessExecutionLogsPage />} />
            </Route>
        </Route>
    </Route>
);

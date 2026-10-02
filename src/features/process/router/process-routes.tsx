/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { lazy } from 'react';
import { Navigate, Route } from 'react-router';

const ProcessResultsPage = lazy(() => import('../results/pages/ProcessResultsPage'));
const ProcessExecutionPage = lazy(() => import('../results/pages/ProcessExecutionPage'));

export const processRoutes = (
    <Route path="process">
        <Route index element={<Navigate to="results" replace />} />
        <Route path="results">
            <Route index element={<ProcessResultsPage />} />
            <Route path=":id">
                <Route index element={<ProcessExecutionPage />} />
            </Route>
        </Route>
    </Route>
);

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Navigate, Route } from 'react-router';
import { ProcessExecutePage } from '../execute/pages/ProcessExecutePage';
import { ProcessResultsPage } from '../results/pages/ProcessResultsPage';
import { ProcessStepInfosPage } from '../results/pages/ProcessStepInfosPage';

export const processRoutes = (
    <Route path="process">
        <Route index element={<Navigate to="execute" replace />} />
        <Route path="execute" element={<ProcessExecutePage />} />
        <Route path="results">
            <Route index element={<ProcessResultsPage />} />
            <Route path=":id">
                <Route path="step-infos" element={<ProcessStepInfosPage />} />
            </Route>
        </Route>
    </Route>
);

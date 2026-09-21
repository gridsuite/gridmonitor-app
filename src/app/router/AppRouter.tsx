/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getPreLoginPath } from '@gridsuite/commons-ui';
import { Box, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { Routes, Route, Navigate, Outlet } from 'react-router';
import { Loader } from 'shared/ui/Loader';
import { Suspense } from 'react';
import { PROCESS_CONFIG_PATHS } from 'features/process-config/router/process-config-paths';
import { APP_PATHS } from './app-paths';
import { processRoutes } from '../../features/process/router/process-routes';
import { processConfigRoutes } from '../../features/process-config/router/process-config-routes';

export function AppRouter() {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route path={APP_PATHS.home}>
                    <Route
                        index
                        element={
                            <Box mt={20}>
                                <Typography variant="h3" color="textPrimary" align="center">
                                    Connected
                                </Typography>
                            </Box>
                        }
                    />
                    <Route path="configuration" element={<Navigate to={PROCESS_CONFIG_PATHS.root} replace />} />
                    <Route element={<Outlet />}>
                        {processRoutes}
                        {processConfigRoutes}
                    </Route>
                </Route>
                <Route path={APP_PATHS.signInCallback} element={<Navigate replace to={getPreLoginPath() || '/'} />} />
                <Route
                    path={APP_PATHS.logoutCallback}
                    element={<h1>Error: logout failed; you are still logged in.</h1>}
                />

                <Route
                    path={APP_PATHS.notFound}
                    element={
                        <h1>
                            <FormattedMessage id="PageNotFound" />
                        </h1>
                    }
                />
            </Routes>
        </Suspense>
    );
}

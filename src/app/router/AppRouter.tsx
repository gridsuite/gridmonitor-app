/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getPreLoginPath } from '@gridsuite/commons-ui';
import { Box, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { Routes, Route, Navigate } from 'react-router';

export function AppRouter() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Box mt={20}>
                        <Typography variant="h3" color="textPrimary" align="center">
                            Connected
                        </Typography>
                    </Box>
                }
            />
            <Route path="/sign-in-callback" element={<Navigate replace to={getPreLoginPath() || '/'} />} />
            <Route path="/logout-callback" element={<h1>Error: logout failed; you are still logged in.</h1>} />
            <Route
                path="*"
                element={
                    <h1>
                        <FormattedMessage id="PageNotFound" />
                    </h1>
                }
            />
        </Routes>
    );
}

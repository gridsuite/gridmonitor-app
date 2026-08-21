/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AppBar, Divider, Grid, Toolbar } from '@mui/material';
import { useLocation } from 'react-router';
import { ExecuteButton, SettingsTabs } from './AppNavBar';
import { ConfigurationModeToggle } from './ConfigurationModeToggle';
import { isConfigurationPath } from '../../../app/router/app-paths';
import { UserProfile } from '../../authentication/store/authentication.type';

export type AppTopBarProps = {
    userProfile: UserProfile | null;
};

function AppTopBar({ userProfile }: Readonly<AppTopBarProps>) {
    const location = useLocation();
    const isConfigurationMode = isConfigurationPath(location.pathname);

    return (
        <AppBar position="sticky" color="default" elevation={0}>
            {userProfile !== null && (
                <Toolbar sx={{ height: '56px', px: '24px' }}>
                    <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        width="100%"
                        wrap="nowrap"
                        spacing={2}
                    >
                        <Grid>
                            <SettingsTabs />
                        </Grid>
                        <Grid container spacing={2} alignItems="center" wrap="nowrap">
                            <Grid>
                                <ExecuteButton />
                            </Grid>
                            {isConfigurationMode && (
                                <Grid>
                                    <Divider orientation="vertical" sx={{ height: 50 }} />
                                </Grid>
                            )}
                            <Grid>
                                <ConfigurationModeToggle />
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            )}
        </AppBar>
    );
}

export default AppTopBar;

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AppBar, Divider, Grid, Toolbar } from '@mui/material';
import { useLocation } from 'react-router';
import { SettingsTabs, ExecuteButton } from './AppNavBar';
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
        <AppBar position="static" color="default" elevation={0}>
            {userProfile !== null && (
                <Toolbar sx={{ height: '56px', px: '24px', alignItems: 'center' }}>
                    <Grid
                        container
                        columns={{ xs: 6, sm: 12 }}
                        columnSpacing={{ xs: '12px', sm: '16px' }}
                        sx={{ width: '100%', height: '100%', alignItems: 'center' }}
                    >
                        <Grid size={{ xs: 3, sm: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
                            <SettingsTabs />
                        </Grid>
                        <Grid
                            size={{ xs: 3, sm: 6 }}
                            sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
                        >
                            <ExecuteButton />
                            {isConfigurationMode && <Divider orientation="vertical" sx={{ mx: 2, height: 50 }} />}
                            <ConfigurationModeToggle />
                        </Grid>
                    </Grid>
                </Toolbar>
            )}
        </AppBar>
    );
}

export default AppTopBar;

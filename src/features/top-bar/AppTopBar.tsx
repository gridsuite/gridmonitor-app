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
import { UserProfile } from '../authentication/store/authentication.type';
import { APP_PATHS } from '../../app/router/paths';

/** Returns true when the current pathname is a configuration sub-route (toggle ON state) */
export function isConfigurationPath(pathname: string): boolean {
    return pathname.startsWith(APP_PATHS.process.root) || pathname.startsWith(APP_PATHS.processConfig.root);
}

export type AppTopBarProps = {
    userProfile: UserProfile | null;
};

function AppTopBar({ userProfile }: Readonly<AppTopBarProps>) {
    const location = useLocation();
    const isConfigurationMode = isConfigurationPath(location.pathname);

    return (
        <AppBar position="sticky" color="default" elevation={0}>
            {userProfile !== null && (
                <Toolbar
                    sx={{
                        minHeight: { xs: 56 },
                        px: 3,
                    }}
                >
                    <Grid
                        container
                        wrap="nowrap"
                        spacing={2}
                        sx={{
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        {isConfigurationMode && (
                            <Grid>
                                <SettingsTabs />
                            </Grid>
                        )}
                        <Grid
                            container
                            spacing={2}
                            wrap="nowrap"
                            sx={{
                                alignItems: 'center',
                                ml: 'auto',
                            }}
                        >
                            {isConfigurationMode && (
                                <Grid>
                                    <ExecuteButton />
                                </Grid>
                            )}
                            {isConfigurationMode && (
                                <Grid>
                                    <Divider orientation="vertical" sx={{ height: 50 }} />
                                </Grid>
                            )}
                            <Grid>
                                <ConfigurationModeToggle isConfigurationMode={isConfigurationMode} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            )}
        </AppBar>
    );
}

export default AppTopBar;

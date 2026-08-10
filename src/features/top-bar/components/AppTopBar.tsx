/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AppBar, Grid, Toolbar } from '@mui/material';
import { UserManagerState } from '@gridsuite/commons-ui';
import { SettingsTabs, ExecuteButton } from './AppNavBar';
import { ConfigurationModeToggle } from './ConfigurationModeToggle';

export type AppTopBarProps = {
    userManager: UserManagerState;
};

function AppTopBar({ userManager: _userManager }: Readonly<AppTopBarProps>) {
    return (
        <AppBar position="static" color="default">
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
                        <ConfigurationModeToggle />
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
}

export default AppTopBar;

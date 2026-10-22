/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Stack } from '@mui/material';
import { PropsWithChildren } from 'react';
import { DevModeBanner, PARAM_DEVELOPER_MODE } from '@gridsuite/commons-ui';
import { usePreferenceState } from '../../features/preferences/hooks/use-preference-state';
import { useStableUserProfile } from 'features/authentication/hooks/use-stable-user-profile';
import AppTopBar from '../../features/top-bar/AppTopBar';
import { AppSideBar } from '../../features/side-bar/AppSideBar';

export type AppTopBarProps = {
    onLogoutClick?: () => void;
};

export function AppLayout({ onLogoutClick, children }: Readonly<PropsWithChildren<AppTopBarProps>>) {
    const [isDeveloperMode] = usePreferenceState(PARAM_DEVELOPER_MODE);
    const userProfile = useStableUserProfile();

    return (
        <Stack
            sx={{
                height: '100vh',
            }}
        >
            {userProfile && isDeveloperMode && <DevModeBanner />}
            <Stack
                direction="row"
                sx={{
                    flex: 1,
                    minHeight: 0,
                    overflow: 'hidden',
                }}
            >
                <AppSideBar onLogoutClick={onLogoutClick} />
                <Stack
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        overflow: 'hidden',
                    }}
                >
                    <AppTopBar userProfile={userProfile} />
                    <Box
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            overflowY: 'auto',
                            overflowX: 'hidden',
                        }}
                    >
                        {children}
                    </Box>
                </Stack>
            </Stack>
        </Stack>
    );
}

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Stack } from '@mui/material';
import { PropsWithChildren } from 'react';
import { DevModeBanner, PARAM_DEVELOPER_MODE } from '@gridsuite/commons-ui';
import { useAppParameterState } from 'features/app-parameters/hooks/use-app-parameter-state';
import { useStableUserProfile } from 'features/authentication/hooks/use-stable-user-profile';
import { AppSideBar } from '../../features/side-bar/components/AppSideBar';

export type AppTopBarProps = {
    onLogoutClick?: () => void;
};

export function AppLayout({ onLogoutClick, children }: Readonly<PropsWithChildren<AppTopBarProps>>) {
    const [isDeveloperMode] = useAppParameterState(PARAM_DEVELOPER_MODE);
    const userProfile = useStableUserProfile() ?? undefined;

    return (
        <Stack height="100vh" overflow="hidden">
            {userProfile && isDeveloperMode && <DevModeBanner />}
            <Stack direction="row" flex={1}>
                <AppSideBar onLogoutClick={onLogoutClick} />
                <Box sx={{ flex: 1 }}>{children}</Box>
            </Stack>
        </Stack>
    );
}

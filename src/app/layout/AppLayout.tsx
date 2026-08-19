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
        <>
            {userProfile && isDeveloperMode && <DevModeBanner />}
            <Stack direction="row" height="100vh" width="100%" overflow="hidden">
                <AppSideBar onLogoutClick={onLogoutClick} />
                <Box sx={{ flex: 1 }}>{children}</Box>
            </Stack>
        </>
    );
}

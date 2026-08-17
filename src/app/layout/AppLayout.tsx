import { Box, Stack } from '@mui/material';
import { PropsWithChildren } from 'react';
import { AppSideBar } from '../../features/side-bar/components/AppSideBar';

export type AppTopBarProps = {
    onLogoutClick?: () => void;
};

export function AppLayout({ onLogoutClick, children }: Readonly<PropsWithChildren<AppTopBarProps>>) {
    return (
        <Stack direction="row" height="100vh" width="100%" overflow="hidden">
            <AppSideBar onLogoutClick={onLogoutClick} />
            <Box sx={{ flex: 1 }}>{children}</Box>
        </Stack>
    );
}

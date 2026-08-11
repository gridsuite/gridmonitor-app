import { Box, Stack } from '@mui/material';
import { PropsWithChildren, useState } from 'react';
import { AppSideBar } from '../../features/side-bar/components/AppSideBar';

export type AppTopBarProps = {
    onLogoutClick?: () => void;
};

export function AppLayout({ onLogoutClick, children }: Readonly<PropsWithChildren<AppTopBarProps>>) {
    const [isSideBarMinimized, setIsSideBarMinimized] = useState(true);

    const toggleSideBarMinimized = (): void => {
        setIsSideBarMinimized((previousIsSideBarMinimized) => !previousIsSideBarMinimized);
    };

    return (
        <Stack direction="row" height="100vh" width="100%" overflow="hidden">
            <AppSideBar
                isMinimized={isSideBarMinimized}
                onToggle={toggleSideBarMinimized}
                onLogoutClick={onLogoutClick}
            />
            <Box sx={{ flex: 1 }}>{children}</Box>
        </Stack>
    );
}

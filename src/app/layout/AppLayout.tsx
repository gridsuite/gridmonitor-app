import { Box, Stack } from '@mui/material';
import { PropsWithChildren, useState } from 'react';
import { AppSideBar } from '../../features/side-bar/components/AppSideBar';

export function AppLayout({ children }: Readonly<PropsWithChildren<{}>>) {
    const [isSideBarMinimized, setIsSideBarMinimized] = useState(true);

    const toggleSideBarMinimized = (): void => {
        setIsSideBarMinimized((previousIsSideBarMinimized) => !previousIsSideBarMinimized);
    };

    return (
        <Stack direction="row" height="100vh" width="100%" overflow="hidden">
            <AppSideBar isMinimized={isSideBarMinimized} onToggle={toggleSideBarMinimized} />
            <Box sx={{ flex: 1 }}>{children}</Box>
        </Stack>
    );
}

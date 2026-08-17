import { Box, Stack } from '@mui/material';
import { useState } from 'react';
import { AppSidebarHeader } from './AppSidebarHeader';
import { AppSidebarFooter } from './footer/AppSidebarFooter';
import { InvertedThemeProvider } from './InvertedThemeProvider';

type SidebarProps = {
    onLogoutClick?: () => void;
};

export function AppSideBar({ onLogoutClick }: Readonly<SidebarProps>) {
    const [isMinimized, setIsMinimized] = useState(true);

    const toggleSideBarMinimized = (): void => {
        setIsMinimized((previousIsSideBarMinimized) => !previousIsSideBarMinimized);
    };
    return (
        <InvertedThemeProvider>
            <Stack
                component="aside"
                sx={{
                    width: isMinimized ? 64 : 224,
                    height: '100%',
                }}
            >
                <AppSidebarHeader isMinimized={isMinimized} />

                <Box
                    sx={{
                        flex: 1,
                    }}
                />

                <AppSidebarFooter
                    isMinimized={isMinimized}
                    toggleSideBarMinimized={toggleSideBarMinimized}
                    onLogoutClick={onLogoutClick}
                />
            </Stack>
        </InvertedThemeProvider>
    );
}

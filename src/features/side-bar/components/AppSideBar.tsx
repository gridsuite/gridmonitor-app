import { Box, Stack } from '@mui/material';
import { AppSidebarHeader } from './AppSidebarHeader';
import { AppSidebarFooter } from './footer/AppSidebarFooter';
import { InvertedThemeProvider } from './InvertedThemeProvider';

type SidebarProps = {
    isMinimized: boolean;
    onToggle: () => void;
};

export function AppSideBar({ isMinimized, onToggle }: Readonly<SidebarProps>) {
    return (
        <InvertedThemeProvider>
            <Stack
                component="aside"
                sx={(theme) => ({
                    width: isMinimized ? 64 : 224,
                    height: '100%',
                    flexShrink: 0,
                    overflow: 'hidden',
                    backgroundColor: theme.palette.background.paper,
                    borderRight: 1,
                    borderColor: 'divider',
                })}
            >
                <AppSidebarHeader isMinimized={isMinimized} />

                <Box
                    component="nav"
                    sx={{
                        flex: 1,
                        minHeight: 0,
                    }}
                />

                <AppSidebarFooter isMinimized={isMinimized} onToggle={onToggle} />
            </Stack>
        </InvertedThemeProvider>
    );
}

import { Divider, MenuList, Stack } from '@mui/material';
import { KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight, Logout } from '@mui/icons-material';
import { ApplicationMenu } from './applications/ApplicationMenu';
import { SidebarMenuItem } from './common/SideBarMenuItem';
import { ProfileMenu } from './profile/ProfileMenu';
import { SettingsMenu } from './settings/SettingsMenu';

interface AppSidebarFooterProps {
    isMinimized: boolean;
    toggleSideBarMinimized: () => void;
    onLogoutClick?: () => void;
}

export function AppSidebarFooter({
    isMinimized,
    toggleSideBarMinimized,
    onLogoutClick,
}: Readonly<AppSidebarFooterProps>) {
    return (
        <Stack sx={{ p: 1 }}>
            <MenuList
                disablePadding
                sx={{
                    '& .MuiDivider-root': {
                        my: 0,
                    },
                }}
            >
                <ApplicationMenu isMinimized={isMinimized} />
                <ProfileMenu isMinimized={isMinimized} />
                <SettingsMenu isMinimized={isMinimized} />
                <SidebarMenuItem
                    label="Se déconnecter"
                    icon={<Logout />}
                    onClick={onLogoutClick}
                    showLabel={!isMinimized}
                />
                <Divider />

                <SidebarMenuItem
                    label="Réduire le menu"
                    icon={isMinimized ? <KeyboardDoubleArrowRight /> : <KeyboardDoubleArrowLeft />}
                    onClick={toggleSideBarMinimized}
                    showLabel={!isMinimized}
                />
            </MenuList>
        </Stack>
    );
}

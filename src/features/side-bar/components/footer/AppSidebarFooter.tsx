import { Divider, MenuList, Stack } from '@mui/material';
import { KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight, Logout } from '@mui/icons-material';
import { ApplicationMenu } from './applications/ApplicationMenu';
import { SidebarMenuItem } from './utils/SideBarMenuItem';
import { ProfileMenu } from './profile/ProfileMenu';
import { SettingsMenu } from './settings/SettingsMenu';

interface AppSidebarFooterProps {
    isMinimized: boolean;
    onToggle: () => void;
    onLogoutClick?: () => void;
}

export function AppSidebarFooter({ isMinimized, onToggle, onLogoutClick }: Readonly<AppSidebarFooterProps>) {
    return (
        <Stack
            sx={{
                px: 1,
                pb: 1,
                flexShrink: 0,
            }}
        >
            <MenuList disablePadding>
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
                    onClick={onToggle}
                    showLabel={!isMinimized}
                />
            </MenuList>
        </Stack>
    );
}

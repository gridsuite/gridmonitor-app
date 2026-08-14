import { Divider, ListItemIcon, ListItemText, ListSubheader, MenuList, Stack, useTheme } from '@mui/material';
import { KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight, Logout } from '@mui/icons-material';
import { CustomMenuItem, CustomNestedMenuItem, MuiStyles, UserInformationDialog } from '@gridsuite/commons-ui';
import { useState } from 'react';
import { sideBarMenuItems } from './footer-menu-items';
import { SideBarSubMenuItem } from './SideBarSubMenuItem';
import { useStableUserProfile } from '../../../authentication/hooks/use-stable-user-profile';

interface AppSidebarFooterProps {
    isMinimized: boolean;
    onToggle: () => void;
    onLogoutClick?: () => void;
}

const styles: MuiStyles = {
    subMenu: {
        '.MuiMenuItem-root, .MuiTypography-root': {
            px: 1.5, // customize padding for text
        },
        px: 1.5, // customize padding for the whole menu item
    },
};

export function AppSidebarFooter({ isMinimized, onToggle, onLogoutClick }: Readonly<AppSidebarFooterProps>) {
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
    const userProfile = useStableUserProfile();

    const openProfileDialog = () => setIsProfileDialogOpen(true);
    return (
        <>
            <Stack
                sx={{
                    px: 1,
                    pb: 1,
                    flexShrink: 0,
                }}
            >
                <MenuList disablePadding>
                    {sideBarMenuItems({ onProfileClick: openProfileDialog }).map((item) => {
                        if (item.type === 'custom') {
                            return 'TO CHANGE';
                        }
                        const { id, label, subMenus, Icon, onClick } = item;
                        if (!subMenus) {
                            return (
                                <CustomMenuItem onClick={onClick} key={id} sx={{ px: 1.5 }}>
                                    {Icon && (
                                        <ListItemIcon>
                                            <Icon />
                                        </ListItemIcon>
                                    )}
                                    <ListItemText primary={!isMinimized ? label : ''} />
                                </CustomMenuItem>
                            );
                        }
                        return (
                            <CustomNestedMenuItem
                                label={!isMinimized ? label : ''}
                                leftIcon={Icon && <Icon />}
                                key={id}
                                // sx={{ px: 1.5 }}
                                sx={styles.subMenu}
                            >
                                {isMinimized && (
                                    <ListSubheader
                                        sx={{
                                            backgroundImage: 'var(--Paper-overlay)',
                                            '.MuiMenuItem-root, .MuiTypography-root': {
                                                px: 1.5, // customize padding for text
                                            },
                                            px: 1.5, // customize padding for the whole menu item
                                        }}
                                    >
                                        {label}
                                    </ListSubheader>
                                )}
                                {subMenus?.map((subMenu) => (
                                    <SideBarSubMenuItem subMenuItem={subMenu} key={subMenu.id} />
                                ))}
                            </CustomNestedMenuItem>
                        );
                    })}
                    <CustomMenuItem sx={{ px: 1.5 }} onClick={onLogoutClick}>
                        <ListItemIcon>
                            <Logout />
                        </ListItemIcon>
                        <ListItemText primary={!isMinimized ? 'Se déconnecter' : ''} />
                    </CustomMenuItem>
                    <Divider />

                    <CustomMenuItem sx={{ px: 1.5 }} onClick={onToggle}>
                        <ListItemIcon>
                            {isMinimized ? <KeyboardDoubleArrowRight /> : <KeyboardDoubleArrowLeft />}
                        </ListItemIcon>
                        {!isMinimized && 'Réduire le menu'}
                    </CustomMenuItem>
                </MenuList>
            </Stack>
            <UserInformationDialog
                openDialog={isProfileDialogOpen}
                onClose={() => setIsProfileDialogOpen(false)}
                userProfile={userProfile ?? undefined}
            />
        </>
    );
}

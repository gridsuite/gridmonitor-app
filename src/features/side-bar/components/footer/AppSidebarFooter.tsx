import { Divider, ListItemIcon, ListItemText, MenuList, Stack, Typography, useTheme } from '@mui/material';
import { KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight, Logout } from '@mui/icons-material';
import { CustomMenuItem, CustomNestedMenuItem } from '@gridsuite/commons-ui';
import { sideBarMenuItems } from './footer-menu-items';
import { SideBarSubMenuItem } from './SideBarSubMenuItem';

interface AppSidebarFooterProps {
    isMinimized: boolean;
    onToggle: () => void;
    onLogoutClick?: () => void;
}

const styles = {
    subMenu: {
        '.MuiMenuItem-root, .MuiTypography-root': {
            px: 1.5, // customize padding for text
        },
        px: 1.5, // customize padding for the whole menu item
    },
};

export function AppSidebarFooter({ isMinimized, onToggle, onLogoutClick }: Readonly<AppSidebarFooterProps>) {
    const theme = useTheme();
    console.log('THEME', theme);
    return (
        <Stack
            sx={{
                px: 1,
                pb: 1,
                flexShrink: 0,
            }}
        >
            <MenuList disablePadding>
                {sideBarMenuItems.map((item) => {
                    if (item.type === 'custom') {
                        return 'TO CHANGE';
                    }
                    const { id, label, subMenus, Icon } = item;
                    if (!subMenus) {
                        return (
                            <CustomMenuItem key={id} sx={{ px: 1.5 }}>
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

                <CustomMenuItem onClick={onToggle}>
                    <ListItemIcon>
                        {isMinimized ? <KeyboardDoubleArrowRight /> : <KeyboardDoubleArrowLeft />}
                    </ListItemIcon>
                    {!isMinimized && 'Réduire le menu'}
                </CustomMenuItem>
            </MenuList>
        </Stack>
    );
}

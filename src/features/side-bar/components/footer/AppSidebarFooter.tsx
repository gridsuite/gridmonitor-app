import { Divider, ListItemIcon, ListItemText, MenuList, Stack, Typography, useTheme } from '@mui/material';
import { KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight } from '@mui/icons-material';
import { CustomMenuItem, CustomNestedMenuItem } from '@gridsuite/commons-ui';
import { sideBarMenuItems } from './footer-menu-items';
import { SideBarSubMenuItem } from './SideBarSubMenuItem';

interface AppSidebarFooterProps {
    isMinimized: boolean;
    onToggle: () => void;
}

const styles = {
    subMenu: {
        '.MuiMenuItem-root, .MuiTypography-root': {
            px: 1.5, // customize padding for text
        },
        // '.MuiMenuItem-root, .MuiSvgIcon-root': {
        //     marginTop: '2px', // customize margin for icon
        // },
        px: 1.5, // customize padding for the whole menu item
    },
};

export function AppSidebarFooter({ isMinimized, onToggle }: Readonly<AppSidebarFooterProps>) {
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
                    const { id, label, subMenus, Icon } = item;
                    if (!subMenus) {
                        return (
                            <CustomMenuItem key={id} sx={{ px: 1.5 }}>
                                <ListItemIcon>
                                    <Icon />
                                </ListItemIcon>
                                <ListItemText primary={!isMinimized ? label : ''} />
                            </CustomMenuItem>
                        );
                    }
                    return (
                        <CustomNestedMenuItem
                            label={!isMinimized ? label : ''}
                            leftIcon={<Icon />}
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

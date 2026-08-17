import { CustomMenuItem, CustomNestedMenuItem, MuiStyles } from '@gridsuite/commons-ui';
import { ListItemIcon, ListItemText } from '@mui/material';
import { MenuItem } from './footer-menu-items';

interface SideBarSubMenuItemProps {
    subMenuItem: MenuItem;
}

const styles: MuiStyles = {
    subMenu: {
        '.MuiMenuItem-root, .MuiTypography-root': {
            px: 1.5, // customize padding for text
        },
        // px: 1.5, // customize padding for the whole menu item
    },
};

export function SideBarSubMenuItem({ subMenuItem }: Readonly<SideBarSubMenuItemProps>) {
    if (subMenuItem.type === 'custom') {
        return subMenuItem.render;
    }

    const { label, Icon, subMenus, id, onClick } = subMenuItem;
    if (!subMenus) {
        return (
            <CustomMenuItem onClick={onClick} key={id} sx={{ px: 1.5 }}>
                <ListItemIcon>{Icon && <ListItemIcon>{Icon}</ListItemIcon>}</ListItemIcon>
                <ListItemText primary={label} />
            </CustomMenuItem>
        );
    }
    return (
        <CustomNestedMenuItem label={label} key={id} sx={styles.subMenu}>
            {subMenus?.map((subMenu) => (
                <SideBarSubMenuItem subMenuItem={subMenu} key={subMenu.id} />
            ))}
        </CustomNestedMenuItem>
    );
}

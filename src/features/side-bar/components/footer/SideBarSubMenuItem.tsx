import { CustomMenuItem, CustomNestedMenuItem } from '@gridsuite/commons-ui';
import { ListItemText } from '@mui/material';
import { MenuItem } from './footer-menu-items';
import { render } from '@testing-library/react';

interface SideBarSubMenuItemProps {
    subMenuItem: MenuItem;
}

const styles = {
    subMenu: {
        '.MuiMenuItem-root, .MuiTypography-root': {
            px: 1.5, // customize padding for text
        },
        px: 1.5, // customize padding for the whole menu item
    },
};

export function SideBarSubMenuItem({ subMenuItem }: Readonly<SideBarSubMenuItemProps>) {
    if (subMenuItem.type === 'custom') {
        return subMenuItem.render;
    }

    const { label, subMenus, id } = subMenuItem;
    if (!subMenus) {
        return (
            <CustomMenuItem key={id} sx={{ px: 1.5 }}>
                <ListItemText primary={label} />
            </CustomMenuItem>
        );
    }
    return (
        <CustomNestedMenuItem
            label={label}
            key={id}
            // sx={{ px: 1.5 }}
            sx={styles.subMenu}
        >
            {subMenus?.map((subMenu) => (
                <SideBarSubMenuItem subMenuItem={subMenu} key={subMenu.id} />
            ))}
        </CustomNestedMenuItem>
    );
}

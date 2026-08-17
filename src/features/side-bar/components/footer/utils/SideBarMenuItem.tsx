import { CustomMenuItem } from '@gridsuite/commons-ui';
import { ListItemIcon, ListItemText, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { submenuFooterStyle } from './submenuFooterStyle';

interface SidebarMenuItemProps {
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
    showLabel?: boolean;
}

export function SidebarMenuItem({ label, icon, onClick, showLabel = true }: Readonly<SidebarMenuItemProps>) {
    return (
        <CustomMenuItem onClick={onClick} sx={submenuFooterStyle.subMenu}>
            {icon} <Typography px={1}>{label}</Typography>
        </CustomMenuItem>
    );
}

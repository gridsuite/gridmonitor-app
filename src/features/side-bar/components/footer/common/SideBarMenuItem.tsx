import { CustomMenuItem } from '@gridsuite/commons-ui';
import { Typography } from '@mui/material';
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
            {icon} {showLabel && <Typography px={1}>{label}</Typography>}
        </CustomMenuItem>
    );
}

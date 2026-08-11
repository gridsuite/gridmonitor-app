import { CustomMenuItem } from '@gridsuite/commons-ui';
import { ListItemIcon, ListItemText, Typography } from '@mui/material';

interface CommonFooterMenuItem {
    id: string;
    isMinimized: boolean;
    label: string;
    Icon: React.ElementType;
    hasSubMenu: boolean;
}

export const CommonFooterMenuItem = ({ id, label, Icon, isMinimized, hasSubMenu }: CommonFooterMenuItem) => {
    <CustomMenuItem key={id} sx={{ px: 1.5 }}>
        <ListItemIcon>
            <Icon />
        </ListItemIcon>
        {!isMinimized && (
            <>
                <ListItemText primary={label} />

                {hasSubMenu && <Typography component="span">›</Typography>}
            </>
        )}
    </CustomMenuItem>;
};

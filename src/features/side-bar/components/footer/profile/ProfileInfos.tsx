import { Box, Divider, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { Person } from '@mui/icons-material';
import { UserProfile } from '../../../../authentication/store/authentication.type';

export function ProfileInfos({ userProfile }: Readonly<{ userProfile?: UserProfile }>) {
    return (
        <>
            <MenuItem
                sx={{
                    px: 2,
                    '&.Mui-disabled': {
                        opacity: 1,
                    },
                }}
                disabled
            >
                <ListItemIcon>
                    <Person fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                    <Box component="span">
                        {userProfile?.name} <br />
                        <Box component="span">{userProfile?.email}</Box>
                    </Box>
                </ListItemText>
            </MenuItem>
            <Divider />
        </>
    );
}

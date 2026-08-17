import { ListSubheader } from '@mui/material';

export function MinimizedSubMenuHeader({ label }: Readonly<{ label: string }>) {
    return (
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
    );
}

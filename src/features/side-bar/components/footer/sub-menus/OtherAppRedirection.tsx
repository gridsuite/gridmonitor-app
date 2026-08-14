import { CustomMenuItem } from '@gridsuite/commons-ui';
import { ListItemText } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import { ElementType } from 'react';

interface OtherAppRedirectionProps {
    appName: string;
    AppLogo: ElementType;
}

export function OtherAppRedirection({ appName, AppLogo }: Readonly<OtherAppRedirectionProps>) {
    return (
        <CustomMenuItem sx={{ px: 2 }}>
            <AppLogo />
            <ListItemText primary={appName} sx={{ pr: 2 }} />
            <OpenInNew />
        </CustomMenuItem>
    );
}

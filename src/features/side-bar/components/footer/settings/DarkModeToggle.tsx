import { CustomMenuItem, DARK_THEME, LIGHT_THEME, PARAM_THEME } from '@gridsuite/commons-ui';
import { Stack, Switch, Typography } from '@mui/material';
import { ChangeEvent } from 'react';
import { useAppParameterState } from '../../../../app-parameters/hooks/use-app-parameter-state';

export function DarkModeToggle() {
    const [mode, setMode] = useAppParameterState(PARAM_THEME);

    const isDarkMode = mode === DARK_THEME;
    const toggleMode = (event: ChangeEvent<HTMLInputElement>) => {
        const targetModeValue = event.target.checked ? DARK_THEME : LIGHT_THEME;
        setMode(targetModeValue) // TODO: improve error handling
            .catch((err) => console.error(err));
    };
    return (
        <CustomMenuItem sx={{ px: 2 }}>
            <Stack width="100%" direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Typography>Mode sombre</Typography>
                <Switch value={isDarkMode} onChange={toggleMode} />
            </Stack>
        </CustomMenuItem>
    );
}

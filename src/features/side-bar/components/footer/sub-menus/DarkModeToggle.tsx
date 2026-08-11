import { DARK_THEME, LIGHT_THEME, PARAM_THEME } from '@gridsuite/commons-ui';
import { MenuItem, Switch } from '@mui/material';
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
        <MenuItem>
            Mode sombre <Switch value={isDarkMode} onChange={toggleMode} />
        </MenuItem>
    );
}

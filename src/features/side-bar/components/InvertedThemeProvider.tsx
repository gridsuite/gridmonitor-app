import { ThemeProvider, ScopedCssBaseline } from '@mui/material';
import { DARK_THEME, LIGHT_THEME, PARAM_THEME } from '@gridsuite/commons-ui';
import { getAppTheme } from '../../../app/config/app-theme';
import { useGetConfigParameterWithFallback } from '../../app-parameters/hooks/use-get-config-parameter-with-fallback';

export function InvertedThemeProvider({ children }: Readonly<React.PropsWithChildren>) {
    const { data: theme } = useGetConfigParameterWithFallback(PARAM_THEME);
    const invertedTheme = theme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;

    return (
        <ThemeProvider theme={getAppTheme(invertedTheme)}>
            <ScopedCssBaseline>{children}</ScopedCssBaseline>
        </ThemeProvider>
    );
}

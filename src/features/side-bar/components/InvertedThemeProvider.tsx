import { ThemeProvider, ScopedCssBaseline, Theme, createTheme } from '@mui/material';
import { DARK_THEME, LIGHT_THEME, PARAM_THEME } from '@gridsuite/commons-ui';
import { getAppTheme } from '../../../app/config/app-theme';
import { useGetConfigParameterWithFallback } from '../../app-parameters/hooks/use-get-config-parameter-with-fallback';

const overrideDarkTheme: Theme = {
    palette: {
        background: {
            paper: '#263238',
            default: '#263238',
        },
    },
};

export function InvertedThemeProvider({ children }: Readonly<React.PropsWithChildren>) {
    const { data: themeId } = useGetConfigParameterWithFallback(PARAM_THEME);
    const invertedThemeId = themeId === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
    const invertedTheme = getAppTheme(invertedThemeId);
    const overriddenTheme =
        invertedThemeId === DARK_THEME ? createTheme(invertedTheme, overrideDarkTheme) : invertedTheme;

    return (
        <ThemeProvider theme={overriddenTheme}>
            <ScopedCssBaseline>{children}</ScopedCssBaseline>
        </ThemeProvider>
    );
}

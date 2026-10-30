/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { StyledEngineProvider, ThemeProvider, CssBaseline } from '@mui/material';
import {
    CardErrorBoundary,
    getComputedLanguage,
    NotificationsProvider,
    PARAM_LANGUAGE,
    PARAM_THEME,
    SnackbarProvider,
} from '@gridsuite/commons-ui';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'app/store/store';
import App from 'app/App';
import { appMessages } from 'app/config/app-messages';
import { getAppTheme } from 'app/config/app-theme';
import { useNotificationsUrlGenerator } from 'shared/api/ws/use-notifications-url-generator';
import { usePreferenceWithFallback } from '../../features/preferences/hooks/use-preference-with-fallback';
import { SnackRefRegisterer } from './SnackRefRegisterer';

const basename = new URL(document.querySelector('base')?.href ?? '').pathname;

function AppProvidersWithStore() {
    const { data: language } = usePreferenceWithFallback(PARAM_LANGUAGE);
    const computedLanguage = getComputedLanguage(language);
    const { data: theme } = usePreferenceWithFallback(PARAM_THEME);

    const urlMapper = useNotificationsUrlGenerator();

    return (
        <IntlProvider locale={computedLanguage} messages={appMessages[computedLanguage]}>
            <BrowserRouter basename={basename}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={getAppTheme(theme)}>
                        <SnackbarProvider hideIconVariant={false}>
                            <SnackRefRegisterer />
                            <CssBaseline enableColorScheme />
                            <CardErrorBoundary>
                                <NotificationsProvider urls={urlMapper}>
                                    <App />
                                </NotificationsProvider>
                            </CardErrorBoundary>
                        </SnackbarProvider>
                    </ThemeProvider>
                </StyledEngineProvider>
            </BrowserRouter>
        </IntlProvider>
    );
}

function AppWrapper() {
    return (
        <Provider store={store}>
            <AppProvidersWithStore />
        </Provider>
    );
}

export default AppWrapper;

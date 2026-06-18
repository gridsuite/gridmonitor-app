/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { createTheme, CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { it, expect, vi } from 'vitest';
import { SnackbarProvider } from '@gridsuite/commons-ui';
import App from '../App';
import { store } from '../store/store';

vi.mock('uuid', () => ({ v4: () => '00000000-0000-0000-0000-000000000000' }));

it('renders', async () => {
    render(
        <IntlProvider locale="en">
            <BrowserRouter>
                <Provider store={store}>
                    <StyledEngineProvider injectFirst>
                        <ThemeProvider theme={createTheme()}>
                            <SnackbarProvider hideIconVariant={false}>
                                <CssBaseline />
                                <App />
                            </SnackbarProvider>
                        </ThemeProvider>
                    </StyledEngineProvider>
                </Provider>
            </BrowserRouter>
        </IntlProvider>
    );

    expect(await screen.findByText(/monitor/i)).toBeInTheDocument();
});

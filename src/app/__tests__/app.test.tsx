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
import { http, HttpResponse } from 'msw';
import { SnackbarProvider } from '@gridsuite/commons-ui';
import { server } from 'test-utils/msw/server';
import App from '../App';
import { store } from '../store/store';

vi.mock('uuid', () => ({ v4: () => '00000000-0000-0000-0000-000000000000' }));

it('renders', async () => {
    server.use(
        http.get('*/env.json', () =>
            HttpResponse.json({
                appsMetadataServerUrl: 'http://localhost:8070',
            })
        ),
        http.get('http://localhost:8070/version.json', () =>
            HttpResponse.json({
                deployVersion: 'test-version',
            })
        )
    );

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
    const res = await screen.findAllByText((_, element) => {
        return element?.textContent === 'GridMonitor';
    });

    expect(res.length).toBeGreaterThan(0);
});

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { PropsWithChildren, ReactElement } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router';
import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import { DARK_THEME, SnackbarProvider } from '@gridsuite/commons-ui';
import { appMessages } from 'app/config/app-messages';
import { getAppTheme } from 'app/config/app-theme';
import { createTestContext } from './create-test-context';

type ProviderOptions = {
    initialEntries?: string[];
    state?: NonNullable<Parameters<typeof createTestContext>[0]>;
};

export function createTestProviders({ initialEntries = ['/'], state }: ProviderOptions = {}) {
    const { store, wrapper: StoreProvider } = createTestContext(state);
    const wrapper = ({ children }: PropsWithChildren) => (
        <StoreProvider>
            <IntlProvider locale="en" messages={appMessages.en}>
                <MemoryRouter initialEntries={initialEntries}>
                    <StyledEngineProvider injectFirst>
                        <ThemeProvider theme={getAppTheme(DARK_THEME)}>
                            <SnackbarProvider hideIconVariant={false}>{children}</SnackbarProvider>
                        </ThemeProvider>
                    </StyledEngineProvider>
                </MemoryRouter>
            </IntlProvider>
        </StoreProvider>
    );
    return { store, wrapper };
}

export function renderWithProviders(ui: ReactElement, options?: ProviderOptions) {
    const { store, wrapper } = createTestProviders(options);
    return { ...render(ui, { wrapper }), store, user: userEvent.setup() };
}

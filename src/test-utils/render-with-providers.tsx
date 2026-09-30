/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { PropsWithChildren } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, MemoryRouterProps } from 'react-router';
import { IntlProvider } from 'react-intl';
import { setupStore, RootState } from '../app/store/store';
import { defaultAuthTestState } from './create-test-context';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: Partial<RootState>;
    initialEntries?: MemoryRouterProps['initialEntries'];
    store?: ReturnType<typeof setupStore>;
}

export function createTestProviders({
    preloadedState = {},
    initialEntries = ['/'],
    store = setupStore({
        authentication: defaultAuthTestState,
        ...preloadedState,
    } as any),
}: {
    preloadedState?: Partial<RootState>;
    initialEntries?: MemoryRouterProps['initialEntries'];
    store?: ReturnType<typeof setupStore>;
} = {}) {
    return function Wrapper({ children }: PropsWithChildren) {
        return (
            <Provider store={store}>
                <IntlProvider locale="en" messages={{}}>
                    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
                </IntlProvider>
            </Provider>
        );
    };
}

export function renderWithProviders(
    ui: React.ReactElement,
    {
        preloadedState = {},
        initialEntries = ['/'],
        store = setupStore({
            authentication: defaultAuthTestState,
            ...preloadedState,
        } as any),
        ...renderOptions
    }: ExtendedRenderOptions = {}
) {
    const Wrapper = createTestProviders({ store, initialEntries });

    return {
        store,
        user: userEvent.setup(),
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    };
}

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { setupStore } from 'app/store/store';
import { AuthenticationState } from 'features/authentication/store/authentication.type';

export const defaultAuthTestState: AuthenticationState = {
    user: { id_token: 'test-token' } as AuthenticationState['user'],
    signInCallbackError: null,
    authenticationRouterError: null,
    showAuthenticationRouterLogin: false,
};

export const defaultTestState = {
    authentication: defaultAuthTestState,
};

type TestOverrides = {
    authentication?: Partial<AuthenticationState>;
};

export function createTestContext(overrides?: TestOverrides) {
    const mergedState = {
        ...defaultTestState,
        authentication: {
            ...defaultAuthTestState,
            ...overrides?.authentication,
        },
    };

    const store = setupStore(mergedState);
    const wrapper = ({ children }: PropsWithChildren) => <Provider store={store}>{children}</Provider>;
    return {
        store,
        wrapper,
    };
}

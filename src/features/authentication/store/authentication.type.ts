/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AuthenticationRouterErrorState, CommonStoreState } from '@gridsuite/commons-ui';

export type AuthenticationState = CommonStoreState & {
    signInCallbackError: Error | null;
    authenticationRouterError: AuthenticationRouterErrorState | null;
    showAuthenticationRouterLogin: boolean;
};

// Liskov Substitution Principle (LSP) implemented in using the structural subtyping
// The base type for state of authentication feature is StateWithAuthentication
// The root state is a subtype that is usable in every selector of the authentication feature
export type StateWithAuthentication = { authentication: AuthenticationState };

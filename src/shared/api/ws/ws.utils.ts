/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { store } from 'app/store/store';
import { selectAuthentication } from 'features/authentication/store/authentication.selectors';

export function getToken(): string | null {
    const state = store.getState();
    return selectAuthentication(state).user?.id_token ?? null;
}

export function buildWebSocketBaseUrl(): string {
    return document.baseURI.replace(/^http:\/\//, 'ws://').replace(/^https:\/\//, 'wss://');
}

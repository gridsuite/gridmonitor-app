/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { USER, getUserToken } from '@gridsuite/commons-ui';
import { describe, expect, it } from 'vitest';
import { store } from '../store';

describe('store', () => {
    it('exposes the authentication token through the common store', () => {
        expect(getUserToken()).toBeUndefined();

        store.dispatch({
            type: USER,
            user: { id_token: 'bearer-token' },
        });

        expect(getUserToken()).toBe('bearer-token');

        store.dispatch({
            type: USER,
            user: { id_token: 'updated-bearer-token' },
        });

        expect(getUserToken()).toBe('updated-bearer-token');
    });
});

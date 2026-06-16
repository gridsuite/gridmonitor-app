/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { DARK_THEME, LIGHT_THEME, PARAM_THEME, PARAM_DEVELOPER_MODE } from '@gridsuite/commons-ui';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { useGetConfigParameterWithFallback } from 'features/app-parameters/hooks/use-get-config-parameter-with-fallback';
import { server } from 'test-utils/msw/server';
import { createTestContext } from 'test-utils/create-test-context';
import { saveLocalStorageTheme } from 'features/app-parameters/store/app-parameters.local-storage';
import { AuthenticationState } from '../../../authentication/store/authentication.type';
import { USER } from '../../../../test-utils/mocks/gridsuite-commons-ui';

beforeEach(() => localStorage.clear());

describe('useGetConfigParameterWithFallback', () => {
    it('hook returns value from backend', async () => {
        server.use(
            http.get('*/config/v1/applications/common/parameters/theme', () =>
                HttpResponse.json({
                    name: PARAM_THEME,
                    value: LIGHT_THEME,
                })
            )
        );

        const { wrapper } = createTestContext();

        const { result } = renderHook(() => useGetConfigParameterWithFallback(PARAM_THEME), { wrapper });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toBe(LIGHT_THEME);
    });

    it('hook returns localstorage if no user in store', async () => {
        const { wrapper } = createTestContext({ authentication: { user: null } });
        saveLocalStorageTheme(LIGHT_THEME);

        const { result } = renderHook(() => useGetConfigParameterWithFallback(PARAM_THEME), {
            wrapper,
        });

        expect(result.current.data).toBe(LIGHT_THEME);
    });

    it('hook returns fallback if no user in store and nothing in local storage', async () => {
        const { wrapper } = createTestContext({ authentication: { user: null } });

        const { result } = renderHook(() => useGetConfigParameterWithFallback(PARAM_THEME), {
            wrapper,
        });

        expect(result.current.data).toBe(DARK_THEME);
    });

    it('user profile equality comparator covers all field branches', () => {
        const buildUser = (profile: { sub: string; name: string; email: string; profile: string }) =>
            ({ profile }) as unknown as NonNullable<AuthenticationState['user']>;

        const base = { sub: '1', name: 'John', email: 'john@rte.fr', profile: 'admin' };

        const { wrapper, store } = createTestContext({
            authentication: { user: buildUser(base) },
        });

        renderHook(() => useGetConfigParameterWithFallback(PARAM_THEME), { wrapper });

        act(() => store.dispatch({ type: USER, user: buildUser({ ...base }) }));
        act(() => store.dispatch({ type: USER, user: buildUser({ ...base, sub: '2' }) }));
        act(() => store.dispatch({ type: USER, user: buildUser({ ...base, sub: '2', name: 'Jane' }) }));
        act(() =>
            store.dispatch({ type: USER, user: buildUser({ ...base, sub: '2', name: 'Jane', email: 'jane@rte.fr' }) })
        );
        act(() =>
            store.dispatch({
                type: USER,
                user: buildUser({ ...base, sub: '2', name: 'Jane', email: 'jane@rte.fr', profile: 'user' }),
            })
        );
    });
});

describe('useGetConfigParameterWithFallbackForDeveloperMode', () => {
    it('hook returns value from backend', async () => {
        server.use(
            http.get('*/config/v1/applications/monitor/parameters/isDeveloperMode', () =>
                HttpResponse.json({
                    name: PARAM_DEVELOPER_MODE,
                    value: 'true',
                })
            )
        );

        const { wrapper } = createTestContext();

        const { result } = renderHook(() => useGetConfigParameterWithFallback(PARAM_DEVELOPER_MODE), { wrapper });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toBe(true);
    });

    it('hook returns defaults if no user in store', async () => {
        const { wrapper } = createTestContext({ authentication: { user: null } });

        const { result } = renderHook(() => useGetConfigParameterWithFallback(PARAM_DEVELOPER_MODE), {
            wrapper,
        });

        expect(result.current.data).toBe(false);
    });
});

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { DARK_THEME, LIGHT_THEME, PARAM_THEME } from '@gridsuite/commons-ui';
import { server } from 'shared/test-utils/msw/server';
import { createBaseContext } from 'features/test-utils/create-base-context';
import { useGetConfigParameterWithFallback } from 'features/app-parameters/hooks/use-get-config-parameter-with-fallback';
import { saveLocalStorageTheme } from 'features/app-parameters/store/app-parameters.local-storage';

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

        const { wrapper } = createBaseContext();

        const { result } = renderHook(
            () => useGetConfigParameterWithFallback({ paramName: PARAM_THEME, isAuthenticated: true }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toBe(LIGHT_THEME);
    });

    it('hook returns local storage if not authenticated in store', async () => {
        const { wrapper } = createBaseContext();
        saveLocalStorageTheme(LIGHT_THEME);

        const { result } = renderHook(
            () => useGetConfigParameterWithFallback({ paramName: PARAM_THEME, isAuthenticated: false }),
            {
                wrapper,
            }
        );

        expect(result.current.data).toBe(LIGHT_THEME);
    });

    it('hook returns fallback if not authenticated and nothing in local storage', async () => {
        const { wrapper } = createBaseContext();

        const { result } = renderHook(
            () => useGetConfigParameterWithFallback({ paramName: PARAM_THEME, isAuthenticated: false }),
            {
                wrapper,
            }
        );

        expect(result.current.data).toBe(DARK_THEME);
    });
});

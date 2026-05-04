/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from 'test-utils/msw/server';
import { createTestContext } from 'test-utils/create-test-context';
import { useAppParameterState } from 'features/app-parameters/hooks/use-app-parameter-state';
import { DARK_THEME, LIGHT_THEME } from '@gridsuite/commons-ui';

describe('useAppParameterState', () => {
    beforeEach(() => {
        server.use(
            http.get('*/config/v1/applications/*/parameters/theme', () =>
                HttpResponse.json({
                    name: 'theme',
                    value: DARK_THEME,
                })
            )
        );
    });

    it('optimistic update then stays updated on success', async () => {
        server.use(
            http.put('*/config/v1/applications/*/parameters/theme', async () => {
                await new Promise((r) => {
                    setTimeout(r, 50);
                });
                return HttpResponse.json({});
            })
        );
        const { wrapper } = createTestContext();
        const { result } = renderHook(() => useAppParameterState('theme'), { wrapper });

        // check state before updating
        await waitFor(() => {
            const [value] = result.current;
            expect(value).toBe(DARK_THEME);
        });

        // update value to new one
        let promise: Promise<void>;
        act(() => {
            const [, setValue] = result.current;
            promise = setValue(LIGHT_THEME);
        });

        // check optimistic update
        const [optimisticUpdateValue] = result.current;
        expect(optimisticUpdateValue).toBe(LIGHT_THEME);

        // wait for server success
        await act(async () => {
            await promise;
        });

        // check value has not changed
        const [valueAfterSuccess] = result.current;
        expect(valueAfterSuccess).toBe(LIGHT_THEME);
    });

    it('optimistic update then rollback on error', async () => {
        server.use(
            http.put('*/config/v1/applications/*/parameters/theme', async () => {
                await new Promise((r) => {
                    setTimeout(r, 50);
                });
                return HttpResponse.error();
            })
        );

        const { wrapper } = createTestContext();
        const { result } = renderHook(() => useAppParameterState('theme'), { wrapper });

        // check state before updating
        await waitFor(() => {
            const [value] = result.current;
            expect(value).toBe(DARK_THEME);
        });

        // update value to new one
        let promise: Promise<void>;
        act(() => {
            const [, setValue] = result.current;
            promise = setValue(LIGHT_THEME);
        });

        // check optimistic update
        const [optimisticUpdateValue] = result.current;
        expect(optimisticUpdateValue).toBe(LIGHT_THEME);

        // wait for server failure
        await act(async () => {
            try {
                await promise;
            } catch {
                // expected error
            }
        });

        // check value has been changed to old one
        await waitFor(() => {
            const [valueAfterRollback] = result.current;
            expect(valueAfterRollback).toBe(DARK_THEME);
        });
    });
});

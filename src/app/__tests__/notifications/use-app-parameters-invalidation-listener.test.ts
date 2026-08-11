/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { renderHook } from '@testing-library/react';
import { NotificationsUrlKeys, useNotificationsListener } from '@gridsuite/commons-ui';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppParametersInvalidationListener } from 'app/notifications/use-app-parameters-invalidation-listener';
import { invalidateConfigQueries } from 'shared/api/config-api';
import { createTestContext } from 'test-utils/create-test-context';

vi.mock('shared/api/config-api', async (importOriginal) => {
    const actual = await importOriginal<typeof import('shared/api/config-api')>();

    return {
        ...actual,
        invalidateConfigQueries: vi.fn(),
    };
});

vi.mock('@gridsuite/commons-ui', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@gridsuite/commons-ui')>();

    return {
        ...actual,
        useNotificationsListener: vi.fn(),
    };
});

describe('useAppParametersInvalidationListener', () => {
    let listenerCallbackMessage: ((event: MessageEvent) => void) | undefined;

    beforeEach(() => {
        vi.clearAllMocks();
        listenerCallbackMessage = undefined;

        vi.mocked(useNotificationsListener).mockImplementation((_urlKey, options) => {
            listenerCallbackMessage = options.listenerCallbackMessage;
        });
    });

    it('registers a notifications listener on the config channel', () => {
        const { wrapper } = createTestContext();

        expect(listenerCallbackMessage).not.toBeDefined();
        renderHook(() => useAppParametersInvalidationListener(), { wrapper });

        expect(useNotificationsListener).toHaveBeenCalledWith(NotificationsUrlKeys.CONFIG, {
            listenerCallbackMessage: expect.any(Function),
        });
        expect(listenerCallbackMessage).toBeDefined();
    });

    it('invalidates config queries when receiving a parameter name', () => {
        const { wrapper } = createTestContext();

        renderHook(() => useAppParametersInvalidationListener(), { wrapper });

        listenerCallbackMessage?.({
            data: JSON.stringify({
                headers: { parameterName: 'theme' },
            }),
        } as MessageEvent);

        expect(invalidateConfigQueries).toHaveBeenCalledTimes(1);
        expect(invalidateConfigQueries).toHaveBeenCalledWith(expect.anything(), 'theme');
    });

    it('does nothing when parameterName is missing', () => {
        const { wrapper } = createTestContext();

        renderHook(() => useAppParametersInvalidationListener(), { wrapper });

        listenerCallbackMessage?.({
            data: JSON.stringify({
                headers: {},
            }),
        } as MessageEvent);

        expect(invalidateConfigQueries).not.toHaveBeenCalled();
    });

    it('throws on invalid JSON payloads', () => {
        const { wrapper } = createTestContext();

        renderHook(() => useAppParametersInvalidationListener(), { wrapper });

        expect(() => {
            listenerCallbackMessage?.({
                data: 'not-json',
            } as MessageEvent);
        }).toThrow(SyntaxError);
        expect(invalidateConfigQueries).not.toHaveBeenCalled();
    });
});

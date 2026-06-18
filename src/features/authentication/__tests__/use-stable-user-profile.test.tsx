/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { act, render } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { USER } from '@gridsuite/commons-ui';
import { createTestContext } from '../../../test-utils/create-test-context';
import { useStableUserProfile } from '../hooks/use-stable-user-profile';

// test function used only to count the number of render from TestComponent
const renderSpy = vi.fn();

function TestComponent() {
    const userProfile = useStableUserProfile();

    renderSpy(userProfile);

    return null;
}

describe('useStableUserProfile', () => {
    beforeEach(() => {
        renderSpy.mockClear();
    });

    it('should not rerender when only ignored user profile fields change', () => {
        const { wrapper, store } = createTestContext();

        const initialProfile = {
            sub: '123',
            name: 'userName',
            email: 'user@test.com',
            profile: 'user',
            exp: 123,
            access_token: 'old-token',
        };

        // TODO: change all store disptach user with setLoggedUser from commons-ui when it does not have to be mocked
        act(() => {
            store.dispatch({
                type: USER,
                user: {
                    profile: initialProfile,
                },
            });
        });

        render(<TestComponent />, { wrapper });

        expect(renderSpy).toHaveBeenCalledTimes(1);

        act(() => {
            store.dispatch({
                type: USER,
                user: {
                    profile: {
                        ...initialProfile,
                        exp: 456,
                        access_token: 'new-token',
                    },
                },
            });
        });

        expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('should rerender when an identity user profile field changes', () => {
        const { wrapper, store } = createTestContext();

        const initialProfile = {
            sub: '123',
            name: 'userName',
            email: 'user@test.com',
            profile: 'user',
            exp: 123,
            access_token: 'old-token',
        };

        act(() => {
            store.dispatch({
                type: USER,
                user: {
                    profile: initialProfile,
                },
            });
        });

        render(<TestComponent />, { wrapper });

        expect(renderSpy).toHaveBeenCalledTimes(1);

        act(() => {
            store.dispatch({
                type: USER,
                user: {
                    profile: {
                        ...initialProfile,
                        email: 'new@test.com',
                    },
                },
            });
        });

        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect(renderSpy).toHaveBeenLastCalledWith(
            expect.objectContaining({
                email: 'new@test.com',
            })
        );
    });
});

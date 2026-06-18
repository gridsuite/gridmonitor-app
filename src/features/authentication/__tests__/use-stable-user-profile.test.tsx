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

const initialProfile = {
    sub: '123',
    name: 'userName',
    email: 'user@test.com',
    profile: 'user',
    exp: 123,
    access_token: 'old-token',
};

function TestComponent() {
    const userProfile = useStableUserProfile();

    renderSpy(userProfile);

    return null;
}

function renderTestComponent() {
    const { wrapper, store } = createTestContext();

    const updateProfile = (changes: Partial<typeof initialProfile> = {}) => {
        // TODO: replace with setLoggedUser from commons-ui when it no longer has to be mocked
        act(() => {
            store.dispatch({
                type: USER,
                user: {
                    profile: {
                        ...initialProfile,
                        ...changes,
                    },
                },
            });
        });
    };

    updateProfile();
    render(<TestComponent />, { wrapper });

    return { updateProfile };
}

describe('useStableUserProfile', () => {
    beforeEach(() => {
        renderSpy.mockClear();
    });

    it('should not rerender when only ignored user profile fields change', () => {
        const { updateProfile } = renderTestComponent();

        expect(renderSpy).toHaveBeenCalledTimes(1);

        updateProfile({
            exp: 456,
            access_token: 'new-token',
        });

        expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('should rerender when an identity user profile field changes', () => {
        const { updateProfile } = renderTestComponent();

        expect(renderSpy).toHaveBeenCalledTimes(1);

        updateProfile({
            email: 'new@test.com',
        });

        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect(renderSpy).toHaveBeenLastCalledWith(
            expect.objectContaining({
                email: 'new@test.com',
            })
        );
    });
});

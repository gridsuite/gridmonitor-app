/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppLayout } from '../AppLayout';

const mocks = vi.hoisted(() => ({
    useAppParameterState: vi.fn(),
    useStableUserProfile: vi.fn(),
    appSideBar: vi.fn(),
}));

vi.mock('@gridsuite/commons-ui', async (importOriginal) => {
    const original = await importOriginal<typeof import('@gridsuite/commons-ui')>();

    return {
        ...original,
        DevModeBanner: () => <div>Developer mode</div>,
    };
});

vi.mock('features/app-parameters/hooks/use-app-parameter-state', () => ({
    useAppParameterState: mocks.useAppParameterState,
}));

vi.mock('features/authentication/hooks/use-stable-user-profile', () => ({
    useStableUserProfile: mocks.useStableUserProfile,
}));

vi.mock('features/side-bar/components/AppSideBar', () => ({
    AppSideBar: (props: { onLogoutClick?: () => void }) => {
        mocks.appSideBar(props);
        return null;
    },
}));

describe('AppLayout', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.useAppParameterState.mockImplementation((paramName: string) => {
            if (paramName === 'isDeveloperMode') {
                return [false];
            }

            return [undefined];
        });
        mocks.useStableUserProfile.mockReturnValue({ sub: 'test-user' });
    });

    it('renders its children and forwards the logout handler to the side bar', () => {
        const onLogoutClick = vi.fn();

        render(
            <AppLayout onLogoutClick={onLogoutClick}>
                <main>Application content</main>
            </AppLayout>
        );

        expect(screen.getByText('Application content')).toBeInTheDocument();
        expect(mocks.appSideBar).toHaveBeenCalledWith(
            expect.objectContaining({
                onLogoutClick,
            })
        );
    });

    it('displays the developer mode banner for an authenticated user when developer mode is enabled', () => {
        mocks.useAppParameterState.mockImplementation((paramName: string) => {
            if (paramName === 'isDeveloperMode') {
                return [true];
            }

            return [undefined];
        });

        render(<AppLayout>Application content</AppLayout>);

        expect(screen.getByText('Developer mode')).toBeInTheDocument();
    });

    it('does not display the developer mode banner when developer mode is disabled', () => {
        render(<AppLayout>Application content</AppLayout>);

        expect(screen.queryByText('Developer mode')).not.toBeInTheDocument();
    });

    it('does not display the developer mode banner without an authenticated user', () => {
        mocks.useAppParameterState.mockImplementation((paramName: string) => {
            if (paramName === 'isDeveloperMode') {
                return [true];
            }

            return [undefined];
        });
        mocks.useStableUserProfile.mockReturnValue(null);

        render(<AppLayout>Application content</AppLayout>);

        expect(screen.queryByText('Developer mode')).not.toBeInTheDocument();
    });
});

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DARK_THEME, LIGHT_THEME, PARAM_DEVELOPER_MODE, PARAM_LANGUAGE, PARAM_THEME } from '@gridsuite/commons-ui';
import { AppSideBar } from '../AppSideBar';

const mocks = vi.hoisted(() => ({
    commonAppSideBar: vi.fn(),
    fetchAppsMetadata: vi.fn(),
    fetchVersion: vi.fn(),
    getServersInfos: vi.fn(),
    useAppParameterState: vi.fn(),
    useStableUserProfile: vi.fn(),
}));

vi.mock('@gridsuite/commons-ui', async (importOriginal) => {
    const original = await importOriginal<typeof import('@gridsuite/commons-ui')>();

    return {
        ...original,
        AppSideBar: (props: unknown) => {
            mocks.commonAppSideBar(props);
            return null;
        },
        fetchAppsMetadata: mocks.fetchAppsMetadata,
    };
});

vi.mock('features/app-parameters/hooks/use-app-parameter-state', () => ({
    useAppParameterState: mocks.useAppParameterState,
}));

vi.mock('features/authentication/hooks/use-stable-user-profile', () => ({
    useStableUserProfile: mocks.useStableUserProfile,
}));

vi.mock('assets/images/gridmonitor_logo.svg?react', () => ({
    default: () => null,
}));

vi.mock('shared/config/version', () => ({
    fetchVersion: mocks.fetchVersion,
}));

vi.mock('features/top-bar/api/get-servers-infos', () => ({
    getServersInfos: mocks.getServersInfos,
}));

describe('AppSideBar', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mocks.fetchAppsMetadata.mockResolvedValue([{ name: 'Study', url: 'http://study.local' }]);
        mocks.fetchVersion.mockResolvedValue({
            deployVersion: 'test-version',
        });
        mocks.getServersInfos.mockResolvedValue([]);
        mocks.useStableUserProfile.mockReturnValue(null);

        mocks.useAppParameterState.mockImplementation((paramName: string) => {
            switch (paramName) {
                case PARAM_THEME:
                    return [LIGHT_THEME, vi.fn()];
                case PARAM_LANGUAGE:
                    return ['en', vi.fn()];
                case PARAM_DEVELOPER_MODE:
                    return [false, vi.fn()];
                default:
                    return [undefined, vi.fn()];
            }
        });
    });

    it('passes the inverted dark theme when the application theme is light', async () => {
        render(<AppSideBar />);

        await waitFor(() => {
            expect(mocks.commonAppSideBar).toHaveBeenCalledWith(
                expect.objectContaining({
                    currentTheme: LIGHT_THEME,
                    sideBarTheme: expect.objectContaining({
                        palette: expect.objectContaining({
                            mode: 'dark',
                        }),
                    }),
                })
            );
        });
    });

    it('passes the inverted light theme when the application theme is dark', () => {
        mocks.useAppParameterState.mockImplementation((paramName: string) => {
            switch (paramName) {
                case PARAM_THEME:
                    return ['Dark', vi.fn()];
                case PARAM_LANGUAGE:
                    return ['fr', vi.fn()];
                case PARAM_DEVELOPER_MODE:
                    return [true, vi.fn()];
                default:
                    return [undefined, vi.fn()];
            }
        });

        render(<AppSideBar />);

        expect(mocks.commonAppSideBar).toHaveBeenCalledWith(
            expect.objectContaining({
                currentTheme: DARK_THEME,
                selectedLanguage: 'fr',
                isDeveloperMode: true,
                sideBarTheme: expect.objectContaining({
                    palette: expect.objectContaining({
                        mode: 'light',
                    }),
                }),
            })
        );
    });

    it('loads application metadata when a user is authenticated', async () => {
        mocks.useStableUserProfile.mockReturnValue({
            sub: 'test-user',
        });

        render(<AppSideBar />);

        await waitFor(() => {
            expect(mocks.fetchAppsMetadata).toHaveBeenCalledTimes(1);
        });
    });

    it('does not load application metadata when no authenticated user is available', () => {
        mocks.useStableUserProfile.mockReturnValue(null);

        render(<AppSideBar />);

        expect(mocks.fetchAppsMetadata).not.toHaveBeenCalled();
    });
});

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { PROCESS_PATHS } from 'features/process/router/process-paths';
import { PROCESS_CONFIG_PATHS } from 'features/process-config/router/process-config-paths';
import { APP_PATHS } from 'app/router/app-paths';
import messagesEn from 'shared/translations/en/common.json';
import AppTopBar from '../AppTopBar';
import type { UserProfile } from '../../../authentication/store/authentication.type';

const userProfile = {
    sub: '123',
    name: 'Test User',
    email: 'test@example.com',
    profile: 'user',
    exp: 9999999999,
} as UserProfile;

function renderTopBar(initialPath: string, profile: UserProfile | null = userProfile) {
    return render(
        <IntlProvider locale="en" messages={messagesEn}>
            <MemoryRouter initialEntries={[initialPath]}>
                <Routes>
                    <Route path="*" element={<AppTopBar userProfile={profile} />} />
                </Routes>
            </MemoryRouter>
        </IntlProvider>
    );
}

describe('AppTopBar', () => {
    it('renders nothing inside the toolbar when userProfile is null', () => {
        renderTopBar(APP_PATHS.gridmonitor, null);

        expect(screen.queryByRole('tab')).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /Execute process/i })).not.toBeInTheDocument();
    });

    it('renders the toolbar content when userProfile is provided', () => {
        renderTopBar(PROCESS_CONFIG_PATHS.root);

        expect(screen.getByRole('tab', { name: /Configuration/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Execute process/i })).toBeInTheDocument();
    });

    it('renders the divider when on a configuration path (isConfigurationMode = true)', () => {
        renderTopBar(PROCESS_CONFIG_PATHS.root);

        // MUI Divider renders as <hr>
        expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('does not render the divider when not on a configuration path (isConfigurationMode = false)', () => {
        const { container } = renderTopBar(APP_PATHS.gridmonitor);

        expect(container.querySelector('hr')).not.toBeInTheDocument();
    });

    it('renders the divider when on the gridmonitorConfigBase path (first branch of isConfigurationPath)', () => {
        renderTopBar(PROCESS_PATHS.root);

        expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('renders the divider when on the gridmonitorConfigProcessConfig path (second branch of isConfigurationPath)', () => {
        renderTopBar(PROCESS_CONFIG_PATHS.root);

        expect(screen.getByRole('separator')).toBeInTheDocument();
    });
});

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { APP_PATHS } from 'app/router/app-paths';
import { PROCESS_CONFIG_PATHS } from 'features/process-config/router/process-config-paths';
import { renderWithProviders } from 'test-utils/render-with-providers';
import { ConfigurationModeToggle } from '../ConfigurationModeToggle';

describe('ConfigurationModeToggle', () => {
    it.each([false, true])('reflects configuration mode %s', (isConfigurationMode) => {
        renderWithProviders(<ConfigurationModeToggle isConfigurationMode={isConfigurationMode} />);
        expect(screen.getByRole('switch', { name: 'Configuration mode' })).toHaveProperty(
            'checked',
            isConfigurationMode
        );
    });

    it.each([
        { from: APP_PATHS.home, to: PROCESS_CONFIG_PATHS.root, checked: false },
        { from: PROCESS_CONFIG_PATHS.root, to: APP_PATHS.home, checked: true },
    ])('navigates from $from to $to', async ({ from, to, checked }) => {
        const { user } = renderWithProviders(
            <Routes>
                <Route path={from} element={<ConfigurationModeToggle isConfigurationMode={checked} />} />
                <Route path={to} element={<h1>Destination</h1>} />
            </Routes>,
            { initialEntries: [from] }
        );
        await user.click(screen.getByRole('switch', { name: 'Configuration mode' }));
        expect(await screen.findByRole('heading', { name: 'Destination' })).toBeVisible();
    });
});

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { APP_PATHS } from 'app/router/app-paths';
import { PROCESS_PATHS } from 'features/process/router/process-paths';
import messagesEn from 'shared/translations/en/common.json';
import { ConfigurationModeToggle } from '../ConfigurationModeToggle';

function renderToggle(initialPath: string, isConfigurationMode: boolean) {
    return render(
        <IntlProvider locale="en" messages={messagesEn}>
            <MemoryRouter initialEntries={[initialPath]}>
                <Routes>
                    <Route path="*" element={<ConfigurationModeToggle isConfigurationMode={isConfigurationMode} />} />
                </Routes>
            </MemoryRouter>
        </IntlProvider>
    );
}

describe('ConfigurationModeToggle', () => {
    it('renders the label "Configuration mode"', () => {
        renderToggle(APP_PATHS.gridmonitor, false);

        expect(screen.getByLabelText('Configuration mode')).toBeInTheDocument();
    });

    it('is unchecked when the current path is not a configuration path', () => {
        renderToggle(APP_PATHS.gridmonitor, false);

        expect(screen.getByRole('switch')).not.toBeChecked();
    });

    it('is checked when the current path is a configuration path', () => {
        renderToggle(PROCESS_PATHS.execute, true);

        expect(screen.getByRole('switch')).toBeChecked();
    });

    it('navigates back to the gridmonitor root when toggled off from a configuration path', async () => {
        const user = userEvent.setup();

        renderToggle(PROCESS_PATHS.execute, false);

        await user.click(screen.getByRole('switch', { name: 'Configuration mode' }));

        expect(screen.getByRole('switch', { name: 'Configuration mode' })).not.toBeChecked();
    });
});

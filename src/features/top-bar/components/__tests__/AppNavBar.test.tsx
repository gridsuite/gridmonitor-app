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
import { SettingsTabs, ExecuteButton } from '../AppNavBar';

function renderWithRouter(ui: React.ReactElement, initialPath: string) {
    return render(
        <IntlProvider locale="en" messages={messagesEn}>
            <MemoryRouter initialEntries={[initialPath]}>
                <Routes>
                    <Route path="*" element={ui} />
                </Routes>
            </MemoryRouter>
        </IntlProvider>
    );
}

// ---------------------------------------------------------------------------
// SettingsTabs
// ---------------------------------------------------------------------------
describe('SettingsTabs', () => {
    it('renders nothing when the current path is not a configuration path', () => {
        const { container } = renderWithRouter(<SettingsTabs />, APP_PATHS.gridmonitor);

        expect(container).toBeEmptyDOMElement();
    });

    it('renders the Configuration and Launch history tabs on a configuration path', () => {
        renderWithRouter(<SettingsTabs />, PROCESS_CONFIG_PATHS.root);

        expect(screen.getByRole('tab', { name: /Configuration/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Launch history/i })).toBeInTheDocument();
    });

    it('marks the Configuration tab as selected when on the process-config path', () => {
        renderWithRouter(<SettingsTabs />, PROCESS_CONFIG_PATHS.root);

        const configTab = screen.getByRole('tab', { name: /Configuration/i });
        expect(configTab).toHaveAttribute('aria-selected', 'true');
    });

    it('marks the Launch history tab as selected when on the results path', () => {
        renderWithRouter(<SettingsTabs />, PROCESS_PATHS.results);

        const historyTab = screen.getByRole('tab', { name: /Launch history/i });
        expect(historyTab).toHaveAttribute('aria-selected', 'true');
    });

    it('each tab links to the correct path', () => {
        renderWithRouter(<SettingsTabs />, PROCESS_CONFIG_PATHS.root);

        expect(screen.getByRole('tab', { name: /Configuration/i })).toHaveAttribute('href', PROCESS_CONFIG_PATHS.root);
        expect(screen.getByRole('tab', { name: /Launch history/i })).toHaveAttribute('href', PROCESS_PATHS.results);
    });

    it('renders no tab as selected when the path does not match any tab', () => {
        renderWithRouter(<SettingsTabs />, PROCESS_PATHS.execute);

        const tabs = screen.getAllByRole('tab');
        tabs.forEach((tab) => {
            expect(tab).toHaveAttribute('aria-selected', 'false');
        });
    });
});

// ---------------------------------------------------------------------------
// ExecuteButton
// ---------------------------------------------------------------------------
describe('ExecuteButton', () => {
    it('renders nothing when the current path is not a configuration path', () => {
        const { container } = renderWithRouter(<ExecuteButton />, APP_PATHS.gridmonitor);

        expect(container).toBeEmptyDOMElement();
    });

    it('renders an "Execute process" button on a configuration path', () => {
        renderWithRouter(<ExecuteButton />, PROCESS_CONFIG_PATHS.root);

        expect(screen.getByRole('link', { name: /Execute process/i })).toBeInTheDocument();
    });

    it('links to the execute path', () => {
        renderWithRouter(<ExecuteButton />, PROCESS_CONFIG_PATHS.root);

        expect(screen.getByRole('link', { name: /Execute process/i })).toHaveAttribute('href', PROCESS_PATHS.execute);
    });
});

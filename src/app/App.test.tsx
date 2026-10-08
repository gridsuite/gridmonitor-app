/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { screen } from '@testing-library/react';
import { it, expect, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../test-utils/msw/server';
import { renderWithProviders } from '../test-utils/render-with-providers';
import App from './App';

vi.mock('@gridsuite/commons-ui', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@gridsuite/commons-ui')>()),
    initializeAuthenticationProd: vi.fn().mockResolvedValue(null),
    useNotificationsListener: vi.fn(),
}));

vi.mock('features/side-bar/components/AppSideBar', () => ({
    AppSideBar: () => <nav aria-label="Sidebar" />,
}));

it('renders the authenticated home route', async () => {
    server.use(
        http.get('*/config/v1/applications/*/parameters/:name', ({ params }) =>
            HttpResponse.json({ name: params.name, value: 'false' })
        )
    );

    renderWithProviders(<App />);

    expect(await screen.findByRole('heading', { name: 'Connected' })).toBeVisible();
    expect(screen.getByRole('switch', { name: 'Configuration mode' })).not.toBeChecked();
});

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createEvent, fireEvent, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from 'test-utils/render-with-providers';
import { LaunchSuccessDialog } from '../LaunchSuccessDialog';

describe('LaunchSuccessDialog', () => {
    it('follows the execution result and closes the dialog', async () => {
        const onClose = vi.fn();
        const { user } = renderWithProviders(
            <Routes>
                <Route path="/" element={<LaunchSuccessDialog executionId="execution-1" open onClose={onClose} />} />
                <Route path="/process/results/execution-1/step-infos" element={<h1>Execution details</h1>} />
            </Routes>
        );
        await user.click(screen.getByRole('link'));
        expect(await screen.findByRole('heading', { name: 'Execution details' })).toBeVisible();
        expect(onClose).toHaveBeenCalledOnce();
    });

    it('keeps the default browser behavior for modified clicks', () => {
        const onClose = vi.fn();
        renderWithProviders(<LaunchSuccessDialog executionId="execution-1" open onClose={onClose} />);

        const link = screen.getByRole('link', { name: 'Follow execution' });
        const clickEvent = createEvent.click(link, { ctrlKey: true, cancelable: true });
        fireEvent(link, clickEvent);

        expect(onClose).not.toHaveBeenCalled();
        expect(clickEvent.defaultPrevented).toBe(false);
    });

    it('closes when the close button is clicked', async () => {
        const onClose = vi.fn();
        const { user } = renderWithProviders(<LaunchSuccessDialog executionId="execution-1" open onClose={onClose} />);
        await user.click(screen.getAllByRole('button', { name: 'Close' })[0]);
        expect(onClose).toHaveBeenCalledOnce();
    });
});

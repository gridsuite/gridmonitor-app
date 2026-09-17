/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { IntlProvider } from 'react-intl';
import { LaunchSuccessDialog } from '../LaunchSuccessDialog';

const messages = { close: 'Close' };

const navigateMock = vi.fn();

vi.mock('react-router', async () => {
    const actual = await vi.importActual<typeof import('react-router')>('react-router');

    return {
        ...actual,
        useNavigate: () => navigateMock,
    };
});

describe('LaunchSuccessDialog', () => {
    it('navigates to the execution result and closes the dialog', () => {
        const onClose = vi.fn();

        render(
            <IntlProvider locale="en" messages={messages}>
                <MemoryRouter>
                    <LaunchSuccessDialog executionId="execution-1" open onClose={onClose} />
                </MemoryRouter>
            </IntlProvider>
        );

        fireEvent.click(screen.getByText('followExecution'));

        expect(navigateMock).toHaveBeenCalledWith('/process/results/execution-1/step-infos');
        expect(onClose).toHaveBeenCalledOnce();
    });

    it('keeps the default browser behavior for modified clicks', () => {
        const onClose = vi.fn();

        render(
            <IntlProvider locale="en" messages={messages}>
                <MemoryRouter>
                    <LaunchSuccessDialog executionId="execution-1" open onClose={onClose} />
                </MemoryRouter>
            </IntlProvider>
        );

        fireEvent.click(screen.getByText('followExecution'), { ctrlKey: true });

        expect(onClose).not.toHaveBeenCalled();
    });

    it('closes when the close button is clicked', () => {
        const onClose = vi.fn();

        render(
            <IntlProvider locale="en" messages={messages}>
                <MemoryRouter>
                    <LaunchSuccessDialog executionId="execution-1" open onClose={onClose} />
                </MemoryRouter>
            </IntlProvider>
        );

        const buttons = screen.getAllByRole('button');

        if (buttons.length === 0) {
            throw new Error('No buttons found');
        }

        const lastButton = buttons[buttons.length - 1];
        fireEvent.click(lastButton);

        expect(onClose).toHaveBeenCalledOnce();
    });
});

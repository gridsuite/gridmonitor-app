/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { IntlProvider } from 'react-intl';
import messagesEn from 'shared/translations/en/common.json';
import { LaunchSuccessDialog } from '../LaunchSuccessDialog';

const messages = messagesEn;

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

        fireEvent.click(screen.getByText(messages.followExecution));

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

        const link = screen.getByText(messages.followExecution);
        const clickEvent = createEvent.click(link, { ctrlKey: true });
        clickEvent.preventDefault();
        fireEvent(link, clickEvent);

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

        fireEvent.click(screen.getByText(messages.close));

        expect(onClose).toHaveBeenCalledOnce();
    });
});

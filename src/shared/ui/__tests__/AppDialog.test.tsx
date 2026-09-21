/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppDialog, AppDialogProps } from '../AppDialog';

const messages = { close: 'Close', back: 'Back', cancel: 'Cancel', validate: 'Validate' };
const onClose = vi.fn();
const onBack = vi.fn();
const onCancel = vi.fn();
const onConfirm = vi.fn();

function renderAppDialog(props: Partial<AppDialogProps> = {}) {
    return render(
        <IntlProvider locale="en" messages={messages}>
            <AppDialog open onClose={onClose} title="Default title" {...props}>
                <div>Dialog body</div>
            </AppDialog>
        </IntlProvider>
    );
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe('AppDialog', () => {
    it('renders its title, description, and content', () => {
        renderAppDialog({});

        expect(screen.getByRole('dialog', { name: 'Default title' })).toBeInTheDocument();
        expect(screen.getByText('Dialog body')).toBeInTheDocument();
    });

    it('calls the supplied action handlers', () => {
        renderAppDialog({ onBack, onCancel, onConfirm });

        fireEvent.click(screen.getByRole('button', { name: 'Close' }));
        fireEvent.click(screen.getByRole('button', { name: 'Back' }));
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        fireEvent.click(screen.getByRole('button', { name: 'Validate' }));

        expect(onClose).toHaveBeenCalledOnce();
        expect(onBack).toHaveBeenCalledOnce();
        expect(onCancel).toHaveBeenCalledOnce();
        expect(onConfirm).toHaveBeenCalledOnce();
    });

    it('does not call a disabled confirmation action', () => {
        renderAppDialog({ onConfirm, confirmDisabled: true });

        fireEvent.click(screen.getByRole('button', { name: 'Validate' }));

        expect(onConfirm).not.toHaveBeenCalled();
    });
});

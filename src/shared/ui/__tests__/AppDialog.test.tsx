/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { IntlProvider } from 'react-intl';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AppDialog } from '../AppDialog';

function renderDialog(props: Partial<React.ComponentProps<typeof AppDialog>> = {}) {
    return render(
        <IntlProvider
            locale="en"
            messages={{
                close: 'Close',
                back: 'Back',
                cancel: 'Cancel',
                validate: 'Validate',
            }}
        >
            <AppDialog open title="Dialog title" onClose={vi.fn()} {...props}>
                <div>Dialog content</div>
            </AppDialog>
        </IntlProvider>
    );
}

describe('AppDialog', () => {
    it('renders the dialog title and content', () => {
        renderDialog({
            description: 'Dialog description',
        });

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Dialog title' })).toBeInTheDocument();
        expect(screen.getByText('Dialog description')).toBeInTheDocument();
        expect(screen.getByText('Dialog content')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        renderDialog({ open: false });

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('calls onClose when the close button is clicked', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        renderDialog({ onClose });

        await user.click(screen.getByRole('button', { name: 'Close' }));

        expect(onClose).toHaveBeenCalledOnce();
    });

    it('calls onClose when the default cancel button is clicked', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        renderDialog({ onClose });

        await user.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(onClose).toHaveBeenCalledOnce();
    });

    it('calls onCancel instead of onClose when provided', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        const onCancel = vi.fn();

        renderDialog({ onClose, onCancel });

        await user.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(onCancel).toHaveBeenCalledOnce();
        expect(onClose).not.toHaveBeenCalled();
    });

    it('renders and calls the back action', async () => {
        const user = userEvent.setup();
        const onBack = vi.fn();

        renderDialog({
            onBack,
            backLabel: 'Previous',
        });

        await user.click(screen.getByRole('button', { name: 'Previous' }));

        expect(onBack).toHaveBeenCalledOnce();
    });

    it('renders and calls the confirm action', async () => {
        const user = userEvent.setup();
        const onConfirm = vi.fn();

        renderDialog({
            onConfirm,
            confirmLabel: 'Create',
        });

        await user.click(screen.getByRole('button', { name: 'Create' }));

        expect(onConfirm).toHaveBeenCalledOnce();
    });

    it('disables the confirm button when confirmDisabled is true', () => {
        const onConfirm = vi.fn();

        renderDialog({
            onConfirm,
            confirmLabel: 'Create',
            confirmDisabled: true,
        });

        expect(screen.getByRole('button', { name: 'Create' })).toBeDisabled();
    });

    it('does not render a confirm button when onConfirm is not provided', () => {
        renderDialog();

        expect(screen.queryByRole('button', { name: 'Validate' })).not.toBeInTheDocument();
    });

    it('uses custom cancel and confirm labels', () => {
        const onConfirm = vi.fn();

        renderDialog({
            cancelLabel: 'Dismiss',
            confirmLabel: 'Save',
            onConfirm,
        });

        expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Validate' })).not.toBeInTheDocument();
    });

    it('uses the default back label and calls onBack', async () => {
        const user = userEvent.setup();
        const onBack = vi.fn();

        renderDialog({ onBack });

        await user.click(screen.getByRole('button', { name: 'Back' }));

        expect(onBack).toHaveBeenCalledOnce();
    });

    it('uses the default confirm label', () => {
        const onConfirm = vi.fn();

        renderDialog({ onConfirm });

        expect(screen.getByRole('button', { name: 'Validate' })).toBeInTheDocument();
    });

    it('renders without a description', () => {
        renderDialog();

        expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-describedby');
    });
});

/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import { IntlProvider } from 'react-intl';
import { AppDialog } from '../AppDialog';
import type { AppDialogProps } from '../AppDialog';

const dialogSpy = vi.hoisted(() => ({
    onClose: null as null | ((event: object, reason: 'backdropClick' | 'escapeKeyDown') => void),
    closeReasons: [] as Array<'backdropClick' | 'escapeKeyDown'>,
}));

vi.mock('@mui/material', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@mui/material')>();
    const RealDialog = actual.Dialog;
    type DialogProps = ComponentProps<typeof RealDialog>;

    function DialogSpy({ onClose: propsOnClose, ...rest }: DialogProps) {
        const wrappedOnClose: NonNullable<DialogProps['onClose']> = (event, reason) => {
            dialogSpy.closeReasons.push(reason);
            propsOnClose?.(event, reason);
        };
        dialogSpy.onClose = wrappedOnClose;
        return createElement(RealDialog, { ...rest, onClose: wrappedOnClose });
    }

    return { ...actual, Dialog: DialogSpy };
});

const messages = {
    close: 'Close',
    back: 'Back',
    cancel: 'Cancel',
    validate: 'Validate',
};

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
    dialogSpy.onClose = null;
    dialogSpy.closeReasons = [];
});

describe('AppDialog', () => {
    describe('rendering', () => {
        it('renders title, description and children when open', () => {
            renderAppDialog({ title: 'My Title', description: 'My description' });

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText('My Title')).toBeInTheDocument();
            expect(screen.getByText('My description')).toBeInTheDocument();
            expect(screen.getByText('Dialog body')).toBeInTheDocument();
        });

        it('is labelled by its title', () => {
            renderAppDialog({ title: 'My Title' });

            expect(screen.getByRole('dialog', { name: 'My Title' })).toBeInTheDocument();
        });

        it('exposes the description through aria-describedby', () => {
            renderAppDialog({ description: 'My description' });

            const describedBy = screen.getByRole('dialog').getAttribute('aria-describedby');
            expect(describedBy).not.toBeNull();
            expect(screen.getByText('My description')).toHaveAttribute('id', describedBy!);
        });

        it.each([undefined, null])('does not link any description when description is %s', (description) => {
            renderAppDialog({ description: description as ReactNode });

            expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-describedby');
        });

        it('renders nothing when closed', () => {
            renderAppDialog({ open: false });

            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('renders correctly in dark mode', () => {
            render(
                <IntlProvider locale="en" messages={messages}>
                    <ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>
                        <AppDialog open onClose={onClose} title="My Title">
                            <div>Dialog body</div>
                        </AppDialog>
                    </ThemeProvider>
                </IntlProvider>
            );

            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

    describe('closing', () => {
        it('calls onClose when the close button is clicked', () => {
            renderAppDialog();

            fireEvent.click(screen.getByRole('button', { name: 'Close' }));

            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it('ignores backdrop clicks', () => {
            renderAppDialog();

            const backdrop = document.querySelector('.MuiBackdrop-root')!;
            fireEvent.mouseDown(backdrop);
            fireEvent.mouseUp(backdrop);
            fireEvent.click(backdrop);

            // MUI did forward a backdropClick close request...
            expect(dialogSpy.closeReasons).toContain('backdropClick');
            // ...but AppDialog deliberately blocked it.
            expect(onClose).not.toHaveBeenCalled();
        });

        it('ignores close requests with reason backdropClick', () => {
            renderAppDialog();

            act(() => {
                dialogSpy.onClose?.({}, 'backdropClick');
            });

            expect(onClose).not.toHaveBeenCalled();
        });

        it('does not react to the Escape key (disableEscapeKeyDown)', () => {
            renderAppDialog();

            fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

            expect(onClose).not.toHaveBeenCalled();
            expect(dialogSpy.closeReasons).not.toContain('escapeKeyDown');
        });

        it('closes for close requests with a reason other than backdropClick', () => {
            renderAppDialog();

            act(() => {
                dialogSpy.onClose?.({}, 'escapeKeyDown');
            });

            expect(dialogSpy.closeReasons).toContain('escapeKeyDown');
            expect(onClose).toHaveBeenCalledTimes(1);
        });
    });

    describe('actions', () => {
        it('calls onBack when the back button is clicked (default label)', () => {
            renderAppDialog({ onBack });

            fireEvent.click(screen.getByRole('button', { name: 'Back' }));

            expect(onBack).toHaveBeenCalledTimes(1);
        });

        it('supports a custom back label', () => {
            renderAppDialog({ onBack, backLabel: 'Go back' });

            expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();
            fireEvent.click(screen.getByRole('button', { name: 'Go back' }));

            expect(onBack).toHaveBeenCalledTimes(1);
        });

        it('does not render a back button without onBack', () => {
            renderAppDialog();

            expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();
        });

        it('closes when the cancel button is clicked (default label)', () => {
            renderAppDialog();

            fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it('calls onCancel instead of onClose when provided', () => {
            renderAppDialog({ onCancel });

            fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

            expect(onCancel).toHaveBeenCalledTimes(1);
            expect(onClose).not.toHaveBeenCalled();
        });

        it('supports a custom cancel label', () => {
            renderAppDialog({ cancelLabel: 'Nope' });

            expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
            fireEvent.click(screen.getByRole('button', { name: 'Nope' }));

            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it('does not render a confirm button without onConfirm', () => {
            renderAppDialog();

            expect(screen.queryByRole('button', { name: 'Validate' })).not.toBeInTheDocument();
        });

        it('calls onConfirm when the confirm button is clicked (default label)', () => {
            renderAppDialog({ onConfirm });

            const confirm = screen.getByRole('button', { name: 'Validate' });
            expect(confirm).toBeEnabled();

            fireEvent.click(confirm);

            expect(onConfirm).toHaveBeenCalledTimes(1);
        });

        it('supports a custom confirm label', () => {
            renderAppDialog({ onConfirm, confirmLabel: 'Confirm it' });

            expect(screen.queryByRole('button', { name: 'Validate' })).not.toBeInTheDocument();
            fireEvent.click(screen.getByRole('button', { name: 'Confirm it' }));

            expect(onConfirm).toHaveBeenCalledTimes(1);
        });

        it('disables the confirm button when confirmDisabled is true', () => {
            renderAppDialog({ onConfirm, confirmDisabled: true });

            const confirm = screen.getByRole('button', { name: 'Validate' });
            expect(confirm).toBeDisabled();

            fireEvent.click(confirm);

            expect(onConfirm).not.toHaveBeenCalled();
        });
    });
});

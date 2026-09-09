/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SyntheticEvent, useId, ReactNode } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, Close as CloseIcon } from '@mui/icons-material';
import { FormattedMessage, useIntl } from 'react-intl';

const paperSx = {
    width: { xs: '95%', sm: '50%' },
    maxWidth: 'none',
    m: 0,
} as const;

export type AppDialogProps = {
    open: boolean;
    onClose: () => void;
    title: ReactNode;
    children: ReactNode;
    description?: ReactNode;
    onBack?: () => void;
    backLabel?: ReactNode;
    onCancel?: () => void;
    cancelLabel?: ReactNode;
    onConfirm?: () => void;
    confirmLabel?: ReactNode;
    confirmDisabled?: boolean;
};

export function AppDialog({
    open,
    onClose,
    title,
    children,
    description,
    onBack,
    backLabel,
    onCancel,
    cancelLabel,
    onConfirm,
    confirmLabel,
    confirmDisabled = false,
}: AppDialogProps) {
    const intl = useIntl();
    const titleId = useId();
    const descriptionId = useId();

    const handleClose = (_event: SyntheticEvent, reason: 'backdropClick' | 'escapeKeyDown') => {
        if (reason === 'backdropClick') {
            return;
        }
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            disableEscapeKeyDown
            aria-labelledby={titleId}
            aria-describedby={description != null ? descriptionId : undefined}
            slotProps={{ paper: { sx: paperSx } }}
        >
            <DialogTitle
                component="div"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    pr: 2,
                }}
            >
                <Box component="span" id={titleId}>
                    {title}
                </Box>
                <IconButton
                    aria-label={intl.formatMessage({ id: 'close' })}
                    onClick={() => onClose()}
                    size="small"
                    edge="end"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {description != null && (
                    <Box component="span" id={descriptionId}>
                        {description}
                    </Box>
                )}
                {children}
            </DialogContent>
            <DialogActions
                sx={{
                    justifyContent: 'space-between',
                    px: 3,
                    pb: 2,
                }}
            >
                {onBack && (
                    <Button variant="outlined" startIcon={<ChevronLeftIcon />} onClick={() => onBack()}>
                        {backLabel ?? <FormattedMessage id="back" />}
                    </Button>
                )}
                <Box sx={{ marginLeft: 'auto', display: 'flex', gap: 1 }}>
                    <Button variant="text" sx={{ textTransform: 'none' }} onClick={() => (onCancel ?? onClose)()}>
                        {cancelLabel ?? <FormattedMessage id="cancel" />}
                    </Button>
                    {onConfirm && (
                        <Button
                            variant="contained"
                            sx={{ textTransform: 'none' }}
                            disabled={confirmDisabled}
                            onClick={() => onConfirm()}
                        >
                            {confirmLabel ?? <FormattedMessage id="validate" />}
                        </Button>
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    );
}

export default AppDialog;

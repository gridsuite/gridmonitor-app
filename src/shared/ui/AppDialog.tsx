/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SyntheticEvent, useId, ReactNode } from 'react';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogProps,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, Close as CloseIcon } from '@mui/icons-material';
import { FormattedMessage, useIntl } from 'react-intl';

const paperSx = {
    width: { xs: '95%', sm: '50%' },
    m: 0,
} as const;

export type AppDialogProps = {
    open: boolean;
    onClose: () => void;
    title: ReactNode;
    children: ReactNode;
    onBack?: () => void;
    backLabel?: ReactNode;
    onCancel?: () => void;
    cancelLabel?: ReactNode;
    onConfirm?: () => void;
    confirmLabel?: ReactNode;
    confirmDisabled?: boolean;
    chipLabel?: string;
    showTitle?: boolean;
    maxWidth?: DialogProps['maxWidth'];
};

export function AppDialog({
    open,
    onClose,
    title,
    children,
    onBack,
    backLabel,
    onCancel,
    cancelLabel,
    onConfirm,
    confirmLabel,
    confirmDisabled = false,
    chipLabel,
    showTitle = true,
    maxWidth,
}: AppDialogProps) {
    const intl = useIntl();
    const titleId = useId();

    const handleClose = (_event: SyntheticEvent, reason: 'backdropClick' | 'escapeKeyDown') => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
        }
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={maxWidth ?? false}
            aria-labelledby={showTitle ? titleId : undefined}
            aria-label={!showTitle && typeof title === 'string' ? title : undefined}
            slotProps={{ paper: { sx: paperSx } }}
        >
            <DialogTitle
                component="div"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: showTitle ? 'space-between' : 'flex-end',
                    gap: 1,
                    pr: 2,
                }}
            >
                {showTitle && (
                    <Box
                        component="div"
                        id={titleId}
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <Typography variant="h5" component="span">
                            {title}
                        </Typography>

                        {chipLabel && (
                            <Chip
                                size="small"
                                label={intl.formatMessage({ id: chipLabel })}
                                color="primary"
                                variant="outlined"
                            />
                        )}
                    </Box>
                )}
                <IconButton
                    aria-label={intl.formatMessage({ id: 'close' })}
                    onClick={() => onClose()}
                    size="small"
                    edge="end"
                    sx={{
                        color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'black'),
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>{children}</DialogContent>
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
                    <Button variant="text" onClick={() => (onCancel ?? onClose)()}>
                        {cancelLabel ?? <FormattedMessage id="cancel" />}
                    </Button>
                    {onConfirm && (
                        <Button variant="contained" disabled={confirmDisabled} onClick={() => onConfirm()}>
                            {confirmLabel ?? <FormattedMessage id="validate" />}
                        </Button>
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    );
}

export default AppDialog;

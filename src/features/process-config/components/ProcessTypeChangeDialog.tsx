/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

type ProcessTypeChangeDialogProps = {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
};

export function ProcessTypeChangeDialog({ open, onCancel, onConfirm }: ProcessTypeChangeDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            disableEscapeKeyDown
            maxWidth="xs"
            PaperProps={{ sx: { minWidth: 320 } }}
            aria-labelledby="process-type-change-warning-title"
        >
            <DialogTitle id="process-type-change-warning-title">
                <FormattedMessage id="processConfigProcessTypeChangeTitle" />
            </DialogTitle>

            <DialogContent>
                <Typography>
                    <FormattedMessage id="processConfigProcessTypeChangeWarning" />
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button variant="text" sx={{ textTransform: 'none' }} onClick={onCancel}>
                    <FormattedMessage id="cancel" />
                </Button>
                <Button variant="contained" sx={{ textTransform: 'none' }} onClick={onConfirm}>
                    <FormattedMessage id="modifier" />
                </Button>
            </DialogActions>
        </Dialog>
    );
}

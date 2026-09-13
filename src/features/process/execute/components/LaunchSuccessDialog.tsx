import { Close, CheckCircle } from '@mui/icons-material';
import {
    Dialog,
    Link,
    DialogTitle,
    IconButton,
    DialogContent,
    Box,
    Typography,
    DialogActions,
    Button,
} from '@mui/material';
import { useId, MouseEvent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link as RouterLink, useNavigate } from 'react-router';

export function LaunchSuccessDialog({
    executionId,
    open,
    onClose,
}: {
    readonly executionId: string;
    readonly open: boolean;
    readonly onClose: () => void;
}) {
    const intl = useIntl();
    const titleId = useId();

    const navigate = useNavigate();
    const path = `/process/results/${executionId}/step-infos`;

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
        if (isModifiedClick) {
            return;
        }

        event.preventDefault();

        navigate(path);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            disableEscapeKeyDown
            maxWidth="xs"
            slotProps={{
                paper: {
                    sx: {
                        minWidth: 444,
                    },
                },
            }}
            aria-labelledby={titleId}
        >
            <DialogTitle component="div" id={titleId} sx={{ display: 'flex', justifyContent: 'flex-end', pr: 2 }}>
                <IconButton aria-label={intl.formatMessage({ id: 'close' })} onClick={onClose} size="small" edge="end">
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <CheckCircle color="primary" sx={{ fontSize: 72, mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        <FormattedMessage id="analysisLaunched" />
                    </Typography>
                    <Link
                        component={RouterLink}
                        to={path}
                        onClick={handleClick}
                        sx={{ color: 'primary.main' }}
                        underline="hover"
                    >
                        <FormattedMessage id="followExecution" />
                    </Link>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="text" sx={{ textTransform: 'none' }} onClick={onClose}>
                    Fermer
                </Button>
            </DialogActions>
        </Dialog>
    );
}

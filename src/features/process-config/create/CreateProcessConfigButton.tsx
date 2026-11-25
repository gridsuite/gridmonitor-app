import { FormattedMessage } from 'react-intl';
import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useState } from 'react';
import { CreateProcessConfigDialog } from './CreateProcessConfigDialog';

export function CreateProcessConfigButton() {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <>
            <Button variant="contained" onClick={() => setDialogOpen(true)} startIcon={<Add />}>
                <FormattedMessage id="createConfig" />
            </Button>
            <CreateProcessConfigDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
        </>
    );
}

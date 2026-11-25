/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

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

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { IconButton } from '@mui/material';
import { ArrowForwardIos as ArrowForwardIosIcon } from '@mui/icons-material';

export function ProcessDetailCellRenderer() {
    return (
        <IconButton className="row-action-button" size="small">
            <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
    );
}

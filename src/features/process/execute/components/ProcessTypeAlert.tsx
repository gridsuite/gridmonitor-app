/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Alert } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export function ProcessTypeAlert({ processTypeLabel }: { processTypeLabel?: string }) {
    return (
        <Alert severity="info" sx={{ p: 1 }}>
            <FormattedMessage id="processType" /> :{' '}
            <strong>
                <FormattedMessage id={processTypeLabel} />
            </strong>
        </Alert>
    );
}

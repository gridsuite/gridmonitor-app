/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Button } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { ICellRendererParams } from 'ag-grid-community';
import { WifiProtectedSetup } from '@mui/icons-material';
import { AutomaticProcessConfigInfos } from '../../../../shared/api/monitor-api';

export type ConfigModifyCellRendererParams = ICellRendererParams<AutomaticProcessConfigInfos> & {
    onModify: (config: AutomaticProcessConfigInfos) => void;
};

export function ConfigModifyCellRenderer({ data, onModify }: Readonly<ConfigModifyCellRendererParams>) {
    if (!data) return null;
    return (
        <Button size="small" variant="contained" onClick={() => onModify(data)}>
            <WifiProtectedSetup />
            <FormattedMessage id="modify" />
        </Button>
    );
}

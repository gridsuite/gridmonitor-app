/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { DefaultCellRenderer } from '@gridsuite/commons-ui';
import { ColDef } from 'ag-grid-community';

export const BASE_DEFAULT_COL_DEF: ColDef = {
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellRenderer: DefaultCellRenderer,
};

export const SORTABLE_COL_DEF: ColDef = {
    filter: true,
    sortable: true,
    resizable: true,
    lockPinned: true,
};

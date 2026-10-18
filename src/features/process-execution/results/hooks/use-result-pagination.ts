/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';

export function useResultPagination(queryKey: string) {
    const [pagination, setPagination] = useState({ queryKey, page: 0, rowsPerPage: 25 });
    if (pagination.queryKey !== queryKey) {
        setPagination({ ...pagination, queryKey, page: 0 });
    }
    return {
        page: pagination.queryKey === queryKey ? pagination.page : 0,
        rowsPerPage: pagination.rowsPerPage,
        setPage: (page: number) => setPagination((previous) => ({ ...previous, page })),
        setRowsPerPage: (rowsPerPage: number) => setPagination((previous) => ({ ...previous, rowsPerPage, page: 0 })),
    };
}

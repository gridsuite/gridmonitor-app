/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit';
import { getErrorMessage } from 'shared/lib/error';
import { snackRef } from 'shared/lib/snack-ref';

type RtkQueryRejectedMetadataArgs = {
    endpointName?: string;
    originalArgs?: unknown;
    type?: 'query' | 'mutation';
};

export const errorMiddleware: Middleware = () => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const endpointName = (action.meta?.arg as RtkQueryRejectedMetadataArgs)?.endpointName;
        snackRef.error({
            headerId: endpointName,
            messageTxt: getErrorMessage(action.payload) ?? undefined,
        });
    }
    return next(action);
};

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { parseError, snackWithFallback } from '@gridsuite/commons-ui';
import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit';
import { getErrorMessage } from 'shared/lib/error';
import { snackRef } from 'shared/lib/snack-ref';

function hasData(payload: unknown): payload is { data: unknown } {
    return typeof payload === 'object' && payload !== null && 'data' in payload;
}

type RtkQueryRejectedMetadataArgs = {
    endpointName?: string;
    originalArgs?: unknown;
    type?: 'query' | 'mutation';
};

export const errorMiddleware: Middleware = () => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const { payload } = action;

        if (hasData(payload)) {
            snackWithFallback(snackRef.error, parseError(JSON.stringify(payload.data)));
        } else {
            const endpointName = (action.meta?.arg as RtkQueryRejectedMetadataArgs)?.endpointName;
            snackRef.error({
                headerId: endpointName,
                messageTxt: getErrorMessage(payload) ?? undefined,
            });
        }
    }

    return next(action);
};

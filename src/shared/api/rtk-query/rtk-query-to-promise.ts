/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

type RtkQueryPromise<T> = {
    unwrap: () => Promise<T>;
    unsubscribe: () => void;
};

export function rtkQueryToPromise<T>(
    promise: RtkQueryPromise<T>,
    options?: {
        onError?: (error: unknown) => void;
    }
): Promise<T> {
    return promise
        .unwrap()
        .catch((error) => {
            options?.onError?.(error);
            throw error;
        })
        .finally(() => {
            promise.unsubscribe();
        });
}

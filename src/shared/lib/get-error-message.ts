/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export function getErrorMessage(error: unknown): string | null {
    if (error instanceof Error) {
        return error.message;
    }
    if (error instanceof Object && 'message' in error) {
        if (
            typeof error.message === 'string' ||
            typeof error.message === 'number' ||
            typeof error.message === 'boolean'
        ) {
            return `${error.message}`;
        }
        return JSON.stringify(error.message ?? undefined) ?? null;
    }
    if (typeof error === 'string') {
        return error;
    }
    return JSON.stringify(error ?? undefined) ?? null;
}

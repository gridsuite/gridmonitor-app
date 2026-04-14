/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SnackInputs, UseSnackMessageReturn } from '@gridsuite/commons-ui';

// Allows imperative snack calls (e.g. from RTK middleware) while using the
// standard useSnackMessage appearance (i18n, persist, variant styling).
// Populated by useRegisterSnackRef inside SnackbarProvider.
let snackFns: UseSnackMessageReturn | null = null;

export const snackRef = {
    register: (fns: UseSnackMessageReturn) => {
        snackFns = fns;
    },
    error: (inputs: SnackInputs) => snackFns?.snackError(inputs),
    warning: (inputs: SnackInputs) => snackFns?.snackWarning(inputs),
    info: (inputs: SnackInputs) => snackFns?.snackInfo(inputs),
    success: (inputs: SnackInputs) => snackFns?.snackSuccess(inputs),
};

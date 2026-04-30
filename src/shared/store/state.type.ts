/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';

// type which is structurally compatible with AppDispatch
export type AnyAppDispatch = ThunkDispatch<unknown, unknown, UnknownAction>;

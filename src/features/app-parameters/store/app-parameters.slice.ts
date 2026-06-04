/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const appParametersSlice = createSlice({
    name: 'appParameters',
    initialState: {
        isDeveloperMode: false,
    },
    reducers: {
        setDeveloperMode: (state, action: PayloadAction<boolean>) => {
            state.isDeveloperMode = action.payload;
        },
    },
});

export const { setDeveloperMode } = appParametersSlice.actions;
export const appParametersReducer = appParametersSlice.reducer;

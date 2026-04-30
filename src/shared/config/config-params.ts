/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Store } from '@reduxjs/toolkit';

export type TokenSelector = (state: unknown) => string | undefined;

interface ConfigParams {
    appName: string;
    tokenSelector: TokenSelector; // only used while configuring store
    store?: Store; // init later after create store
    // future parameters can be added here as needed
}

let configParams: ConfigParams | undefined;

export function configureParams(config: ConfigParams): void {
    if (configParams !== undefined) {
        console.warn('configureParams called more than once — ignoring');
        return;
    }
    configParams = config;
}

export function updateConfigParams(config: Partial<ConfigParams>): void {
    if (configParams === undefined) {
        throw new Error('Config params not initialized. Call configureParams() before using modules.');
    }
    Object.assign(configParams, config);
}

function getConfigParams(): ConfigParams {
    if (configParams === undefined) {
        throw new Error('Config params not initialized. Call configureParams() before using modules.');
    }
    return configParams;
}

export function getTokenSelector(): TokenSelector {
    return getConfigParams().tokenSelector;
}

export function getToken() {
    return getConfigParams().tokenSelector(getConfigParams().store?.getState());
}

export function getAppName() {
    return getConfigParams().appName;
}

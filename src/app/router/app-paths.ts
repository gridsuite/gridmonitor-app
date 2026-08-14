/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const APP_PATHS = {
    home: '/',
    gridmonitor: '/gridmonitor',
    gridmonitorConfigBase: '/gridmonitor/process',
    gridmonitorConfigProcessConfig: '/gridmonitor/process-config',
    signInCallback: '/sign-in-callback',
    logoutCallback: '/logout-callback',
    notFound: '*',
};

/** Returns true when the current pathname is a configuration sub-route (toggle ON state) */
export function isConfigurationPath(pathname: string): boolean {
    return (
        pathname.startsWith(APP_PATHS.gridmonitorConfigBase) ||
        pathname.startsWith(APP_PATHS.gridmonitorConfigProcessConfig)
    );
}

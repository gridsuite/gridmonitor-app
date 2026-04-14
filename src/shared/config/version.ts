/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { fetchEnv } from '@gridsuite/commons-ui';
import { getErrorMessage } from 'shared/lib/error';

export type VersionJson = {
    deployVersion?: string;
};

export function fetchVersion(): Promise<VersionJson> {
    console.info(`Fetching global metadata...`);
    return fetchEnv()
        .then((env) => fetch(`${env.appsMetadataServerUrl}/version.json`))
        .then((response: Response) => response.json())
        .catch((error) => {
            console.error(`Error while fetching the version : ${getErrorMessage(error)}`);
            throw error;
        });
}

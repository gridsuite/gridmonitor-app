/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { store } from 'app/store/store';
import { rtkQueryToPromise } from 'shared/api/rtk-query/rtk-query-to-promise';
import { getErrorMessage } from 'shared/lib/error';
import { AboutInfo, studyApi, Type } from 'shared/api/study-api';
import { GridSuiteModule } from '@gridsuite/commons-ui';

// TODO: remove this function once the backend is fixed with actual types
const toGridSuiteModule = (aboutInfos: AboutInfo[]): GridSuiteModule[] => {
    return aboutInfos.map((aboutInfo) => ({
        name: aboutInfo.name ?? '',
        type: aboutInfo.type ?? Type.Other,
        version: aboutInfo.version ?? '',
        gitTag: aboutInfo.gitTag ?? '',
    }));
};

export const getServersInfos = async () => {
    const serverInfos = rtkQueryToPromise(
        store.dispatch(
            studyApi.endpoints.getSuiteAboutInformation.initiate(
                {},
                {
                    forceRefetch: true,
                }
            )
        ),
        {
            onError: (error) => {
                console.error(`Error while fetching the servers infos : ${getErrorMessage(error)}`);
                throw error;
            },
        }
    );

    return serverInfos.then(toGridSuiteModule);
};

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { GridSuiteModule } from '@gridsuite/commons-ui';
import { store } from 'app/store/store';
import { rtkQueryToPromise } from 'shared/api/rtk-query/rtk-query-to-promise';
import { studyApi } from 'shared/api/study-api/study-api';
import { getErrorMessage } from 'shared/lib/error';

export const getServersInfos = (): Promise<GridSuiteModule[]> => {
    return rtkQueryToPromise(
        store.dispatch(
            studyApi.endpoints.getAboutInfos.initiate(undefined, {
                forceRefetch: true,
            })
        ),
        {
            onError: (error) => {
                console.error(`Error while fetching the servers infos : ${getErrorMessage(error)}`);
                throw error;
            },
        }
    );
};

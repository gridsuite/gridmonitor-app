/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { GridSuiteModule } from '@gridsuite/commons-ui';
import { rtkQueryToPromise } from 'shared/api/rtk-query/rtk-query-to-promise';
import { getErrorMessage } from 'shared/lib/error';
import { AnyAppDispatch } from 'shared/store/state.type';
import { studyApi } from 'shared/api/study-api/study-api';

export const getServersInfos = (dispatch: AnyAppDispatch): Promise<GridSuiteModule[]> => {
    return rtkQueryToPromise(
        dispatch(
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

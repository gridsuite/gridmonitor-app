/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { AppDispatch } from 'app/store/store';
import { studyGeneratedApi } from './study.generated';

export const studyApi = studyGeneratedApi;
export const useLazyGetSuiteAboutInformationQuery = studyGeneratedApi.endpoints.getSuiteAboutInformation.useLazyQuery;

export const invalidateAllQueries = (dispatch: AppDispatch) => {
    dispatch(studyApi.util.resetApiState());
};

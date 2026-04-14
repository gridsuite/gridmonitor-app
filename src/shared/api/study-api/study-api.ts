/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { GridSuiteModule } from '@gridsuite/commons-ui';
import { baseApi } from '../rtk-query/base-api';

const STUDY_URL = `/study/v1`;

const makeStudyUrl = (path: string) => `${STUDY_URL}${path}`;

export const studyApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAboutInfos: builder.query<GridSuiteModule[], void>({
            query: () => makeStudyUrl('/servers/about?view=yyy'),
        }),
    }),
});

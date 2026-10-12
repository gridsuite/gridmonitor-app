/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from 'react';
import { AboutInfo, Type, useLazyGetSuiteAboutInformationQuery } from 'shared/api/study-api';
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

export function useGetServersInfos() {
    const [getServerInfos] = useLazyGetSuiteAboutInformationQuery();

    return useCallback(() => getServerInfos({}).unwrap().then(toGridSuiteModule), [getServerInfos]);
}

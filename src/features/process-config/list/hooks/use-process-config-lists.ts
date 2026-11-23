/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    useGetAutomaticProcessConfigsHistoryQuery,
    useGetAutomaticProcessConfigsQuery,
} from '../../../../shared/api/monitor-api';

export function useProcessConfigLists() {
    const active = useGetAutomaticProcessConfigsQuery();
    const history = useGetAutomaticProcessConfigsHistoryQuery();

    return {
        activeConfigs: active.data ?? [],
        historyConfigs: history.data ?? [],
    };
}

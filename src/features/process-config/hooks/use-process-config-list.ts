/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import { useGetProcessConfigsQuery, ProcessType, PersistedProcessConfig } from 'shared/api/monitor-api';

export function useProcessConfigList() {
    const { data = [], isError, isLoading } = useGetProcessConfigsQuery({ processType: ProcessType.SecurityAnalysis });
    const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

    const onToggleExpanded = (index: number) => {
        setExpandedItems((previous) => ({
            ...previous,
            [index]: !previous[index],
        }));
    };

    // OpenAPI code generation may produce incorrect or imprecise types (ex: missing discriminators).
    // This cast aligns the response with the actual backend contract.
    // Keep in sync with the backend model and remove once the generator issue is fixed.
    const configs = data as PersistedProcessConfig[];

    return {
        configs,
        expandedItems,
        isEmpty: configs.length === 0,
        isError,
        isLoading,
        onToggleExpanded,
    };
}

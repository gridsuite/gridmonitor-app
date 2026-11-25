/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { createCustomAggridReduxProvider } from '../../../shared/lib/aggrid-table-state/create-custom-aggrid-redux-provider';
import { setTableFilters, setTableSort } from './store/process-config-list.slice';

export const ProcessConfigListProvider = createCustomAggridReduxProvider({
    selectState: (state) => state.processConfigList,
    setTableSort,
    setTableFilters,
});

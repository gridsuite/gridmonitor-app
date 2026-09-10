/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Option, SelectInput } from '@gridsuite/commons-ui';
import { PROCESS_CONFIG_TYPES } from '../constants/processConfig.constants';

type ProcessTypeSelectProps = {
    onCheckNewValue: (value: Option | null) => boolean;
};

export function ProcessTypeSelect({ onCheckNewValue }: ProcessTypeSelectProps) {
    return (
        <SelectInput
            name="processType"
            label="processType"
            options={Object.values(PROCESS_CONFIG_TYPES)}
            onCheckNewValue={onCheckNewValue}
            fullWidth
            size="small"
        />
    );
}

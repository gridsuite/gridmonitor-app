/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { DirectoryItemsInput, ElementAttributes, ElementType, RadioInput } from '@gridsuite/commons-ui';
import { Stack } from '@mui/material';
import { ProcessTypeAlert } from './ProcessTypeAlert';

export function ProcessConfigStep({
    processTypeLabel,
    processType,
}: {
    processTypeLabel?: string;
    processType: string;
}) {
    return (
        <Stack spacing={2}>
            <ProcessTypeAlert processTypeLabel={processTypeLabel} />
            <RadioInput
                formProps={{ sx: { paddingLeft: 2 } }}
                name="configSource"
                options={[
                    { id: 'configurations', label: 'Configurations' },
                    { id: 'reference', label: 'referenceConfigurations', disabled: true },
                ]}
            />

            <DirectoryItemsInput
                name="processConfig"
                elementType={ElementType.PROCESS_CONFIG}
                equipmentTypes={[processType]}
                itemFilter={(item: ElementAttributes) =>
                    item?.type === ElementType.PROCESS_CONFIG && item?.specificMetadata?.type === processType
                }
                hideErrorMessage={false}
                allowMultiSelect={false}
                showPlaceHolder={false}
                label="selectConfiguration"
                titleId="selectConfiguration"
            />
        </Stack>
    );
}

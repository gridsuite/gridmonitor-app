/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { DirectoryItemsInput, ElementType, RadioInput } from '@gridsuite/commons-ui';
import { Stack } from '@mui/material';
import { ProcessTypeAlert } from './ProcessTypeAlert';

export function CaseStep({ processTypeLabel }: { processTypeLabel?: string }) {
    return (
        <Stack spacing={2}>
            <ProcessTypeAlert processTypeLabel={processTypeLabel} />
            <RadioInput
                formProps={{ sx: { paddingLeft: 2 } }}
                name="caseSource"
                options={[
                    { id: 'auto', label: 'autoGenCase', disabled: true },
                    { id: 'gridExplore', label: 'gridExploreCase' },
                ]}
            />

            <DirectoryItemsInput
                name="case"
                elementType={ElementType.CASE}
                hideErrorMessage={false}
                allowMultiSelect={false}
                showPlaceHolder={false}
                label="selectSituation"
                titleId="selectSituation"
            />
        </Stack>
    );
}

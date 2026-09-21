/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PROCESS_CONFIG_TYPES, SelectInput } from '@gridsuite/commons-ui';
import { Checkbox, FormControlLabel, Stack } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useIntl } from 'react-intl';

export function ProcessTypeStep({ control }: { control: any }) {
    const intl = useIntl();
    return (
        <Stack spacing={0.5} sx={{ pt: 1 }}>
            <SelectInput
                name="processType"
                label="processType"
                options={Object.values(PROCESS_CONFIG_TYPES)}
                fullWidth
                size="small"
            />
            <Controller
                name="debugMode"
                control={control}
                render={({ field }) => (
                    <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} />}
                        label={intl.formatMessage({ id: 'activateDebugMode' })}
                    />
                )}
            />
        </Stack>
    );
}

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useController } from 'react-hook-form';
import { Checkbox, FormControlLabel, Stack, TextField } from '@mui/material';
import { ExecuteProcessActions } from './ExecuteProcessActions';

type ExecuteProcessFormProps = {
    isLoading: boolean;
    onSubmit: React.SubmitEventHandler<HTMLFormElement>;
};

export function ExecuteProcessForm({ isLoading, onSubmit }: Readonly<ExecuteProcessFormProps>) {
    const {
        field: caseUuidField,
        fieldState: { error: caseUuidError },
    } = useController({
        name: 'caseUuid',
    });

    const {
        field: processConfigUuidField,
        fieldState: { error: processConfigUuidError },
    } = useController({
        name: 'processConfigUuid',
    });

    const { field: debugField } = useController({
        name: 'isDebug',
    });

    const handleDebugChange = (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        debugField.onChange(checked);
    };

    return (
        <form onSubmit={onSubmit} noValidate>
            <Stack spacing={3}>
                <TextField
                    {...caseUuidField}
                    label="Case UUID"
                    fullWidth
                    error={Boolean(caseUuidError)}
                    helperText={caseUuidError?.message}
                />

                <TextField
                    {...processConfigUuidField}
                    label="Process Config UUID"
                    fullWidth
                    error={Boolean(processConfigUuidError)}
                    helperText={processConfigUuidError?.message}
                />

                <FormControlLabel
                    control={<Checkbox checked={Boolean(debugField.value)} onChange={handleDebugChange} />}
                    label="Enable debug mode"
                />

                <ExecuteProcessActions isLoading={isLoading} />
            </Stack>
        </form>
    );
}

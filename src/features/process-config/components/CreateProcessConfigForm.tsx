/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Divider, Stack } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { FieldConstants } from '@gridsuite/commons-ui';
import { useProcessTypeGuard } from '../hooks/useProcessTypeGuard';
import { usePrefillSelection } from '../hooks/usePrefillSelection';
import { ProcessTypeSelect } from './ProcessTypeSelect';
import { GeneralInformationSection } from './GeneralInformationSection';
import { SpecificInformationSection } from './SpecificInformationSection';
import { PrefillConfigSelector } from './PrefillConfigSelector';
import { ProcessTypeChangeDialog } from './ProcessTypeChangeDialog';
import { CreateProcessConfigFormProps } from '../types/processConfig.types';

export function CreateProcessConfigForm({ form, onFetchProcessConfig }: CreateProcessConfigFormProps) {
    const { control } = form;

    const {
        selectedProcessType,
        pendingProcessType,
        checkProcessTypeChange,
        confirmProcessTypeChange,
        cancelProcessTypeChange,
    } = useProcessTypeGuard(form);

    const selectedDirectory = useWatch({ control, name: FieldConstants.DIRECTORY });

    const { isSelectorOpen, openSelector, itemFilter, handleSelect } = usePrefillSelection({
        form,
        onFetchProcessConfig,
        selectedProcessType,
    });

    return (
        <Stack spacing={3} sx={{ paddingTop: 1 }}>
            <ProcessTypeSelect onCheckNewValue={checkProcessTypeChange} />

            {selectedProcessType !== '' && (
                <>
                    <Divider />
                    <GeneralInformationSection directoryId={selectedDirectory?.directoryItemId} />
                    <SpecificInformationSection onPrefill={openSelector} control={control} />
                </>
            )}

            {isSelectorOpen && (
                <PrefillConfigSelector
                    open
                    types={[selectedProcessType]}
                    onClose={handleSelect}
                    itemFilter={itemFilter}
                />
            )}

            <ProcessTypeChangeDialog
                open={pendingProcessType !== null}
                onCancel={cancelProcessTypeChange}
                onConfirm={confirmProcessTypeChange}
            />
        </Stack>
    );
}

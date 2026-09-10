/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CustomFormProvider } from '@gridsuite/commons-ui';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormattedMessage } from 'react-intl';
import { AppDialog } from 'shared/ui/AppDialog';
import { useCreateProcessConfig, useProcessConfigPrefill } from '../hooks/use-create-process-config';
import { formSchema } from '../schemas/createProcessConfig.schema';
import { createProcessConfigFormDefaultValues } from '../constants/processConfig.constants';
import { useCreateProcessConfigSubmit } from '../hooks/useCreateProcessConfigSubmit';
import { CreateProcessConfigForm } from './CreateProcessConfigForm';
import { CreateProcessConfigDialogProps, CreateProcessConfigFormValues } from '../types/processConfig.types';

export function CreateProcessConfigDialog({ open, onClose }: CreateProcessConfigDialogProps) {
    const form = useForm<CreateProcessConfigFormValues>({
        resolver: yupResolver(formSchema),
        mode: 'onSubmit',
        defaultValues: createProcessConfigFormDefaultValues,
    });

    const { createProcessConfig } = useCreateProcessConfig();
    const fetchProcessConfigPrefill = useProcessConfigPrefill();

    const { reset, formState } = form;

    const handleClose = () => {
        reset(createProcessConfigFormDefaultValues);
        onClose();
    };

    const { submit, isSubmitting } = useCreateProcessConfigSubmit({
        form,
        createProcessConfig,
        onClose: handleClose,
    });

    return (
        <AppDialog
            open={open}
            onClose={handleClose}
            onConfirm={submit}
            confirmDisabled={!formState.isValid || isSubmitting}
            title={<FormattedMessage id="processConfigCreateTitle" />}
        >
            <CustomFormProvider {...form} validationSchema={formSchema}>
                <CreateProcessConfigForm form={form} onFetchProcessConfig={fetchProcessConfigPrefill} />
            </CustomFormProvider>
        </AppDialog>
    );
}

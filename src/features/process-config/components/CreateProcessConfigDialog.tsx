/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CustomFormProvider, ProcessConfigForm, useProcessConfigForm } from '@gridsuite/commons-ui';
import { FormattedMessage } from 'react-intl';
import { AppDialog } from 'shared/ui/AppDialog';
import { useCreateProcessConfig, useProcessConfigPrefill } from '../hooks/use-create-process-config';
import { useCreateProcessConfigSubmit } from '../hooks/use-create-process-config-submit';

type CreateProcessConfigDialogProps = {
    open: boolean;
    onClose: () => void;
};

export function CreateProcessConfigDialog({ open, onClose }: Readonly<CreateProcessConfigDialogProps>) {
    const { formMethods, formSchema, defaultValues } = useProcessConfigForm({ mode: 'create' });

    const { createProcessConfig, isCreating } = useCreateProcessConfig();
    const fetchProcessConfigPrefill = useProcessConfigPrefill();

    const { reset, formState } = formMethods;

    const handleClose = () => {
        reset(defaultValues);
        onClose();
    };

    const { submit, isSubmitting } = useCreateProcessConfigSubmit({
        form: formMethods,
        createProcessConfig,
        onClose: handleClose,
    });

    return (
        <AppDialog
            open={open}
            onClose={handleClose}
            onConfirm={submit}
            confirmDisabled={!formState.isValid || isSubmitting || isCreating}
            title={<FormattedMessage id="processConfigCreateTitle" />}
        >
            <CustomFormProvider {...formMethods} validationSchema={formSchema}>
                <ProcessConfigForm form={formMethods} mode="create" onFetchProcessConfig={fetchProcessConfigPrefill} />
            </CustomFormProvider>
        </AppDialog>
    );
}

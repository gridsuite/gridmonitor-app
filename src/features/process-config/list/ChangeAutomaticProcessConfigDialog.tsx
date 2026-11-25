/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormattedMessage, useIntl } from 'react-intl';
import {
    CustomFormProvider,
    DirectoryItemsInput,
    ElementAttributes,
    ElementType,
    YUP_REQUIRED,
} from '@gridsuite/commons-ui';
import { AppDialog } from '../../../shared/ui/AppDialog';
import { ProcessType, useUpdateAutomaticProcessConfigMutation } from '../../../shared/api/monitor-api';

const validationSchema = yup.object({
    processConfig: yup
        .array()
        .of(yup.object({ id: yup.string().required(), name: yup.string().required() }))
        .required()
        .length(1, YUP_REQUIRED),
});

type FormData = yup.InferType<typeof validationSchema>;

const defaultValues: FormData = { processConfig: [] };

type ChangeAutomaticProcessConfigDialogProps = {
    open: boolean;
    processType: ProcessType;
    onClose: () => void;
};

export function ChangeAutomaticProcessConfigDialog({
    open,
    processType,
    onClose,
}: Readonly<ChangeAutomaticProcessConfigDialogProps>) {
    const intl = useIntl();
    const [updateAutomaticProcessConfig, { isLoading }] = useUpdateAutomaticProcessConfigMutation();

    const form = useForm<FormData>({
        resolver: yupResolver(validationSchema),
        defaultValues,
        mode: 'onChange',
    });
    const {
        reset,
        getValues,
        formState: { isValid },
    } = form;

    const handleClose = () => {
        reset(defaultValues);
        onClose();
    };

    const handleConfirm = async () => {
        const uuid = getValues().processConfig?.[0]?.id;
        if (!uuid) return;
        await updateAutomaticProcessConfig({ processType, body: uuid }).unwrap();
        handleClose();
    };

    return (
        <AppDialog
            open={open}
            onClose={handleClose}
            onCancel={handleClose}
            onConfirm={handleConfirm}
            confirmDisabled={isLoading || !isValid}
            title={<FormattedMessage id="changeAutomaticProcessConfigTitle" />}
        >
            <CustomFormProvider {...form} validationSchema={validationSchema}>
                <Stack spacing={2} sx={{ mt: 2 }}>
                    <Typography>
                        {intl.formatMessage({ id: 'AnalysisType' })} :{' '}
                        {intl.formatMessage({ id: processType, defaultMessage: processType })}
                    </Typography>
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
            </CustomFormProvider>
        </AppDialog>
    );
}

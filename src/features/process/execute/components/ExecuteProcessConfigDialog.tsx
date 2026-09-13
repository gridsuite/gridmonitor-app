/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Stepper, Step, StepLabel, Stack, FormControlLabel, Checkbox, Alert } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { AppDialog } from 'shared/ui/AppDialog';
import { PROCESS_CONFIG_TYPES } from 'features/process-config/constants/processConfig.constants';
import {
    CustomFormProvider,
    DirectoryItemsInput,
    ElementAttributes,
    ElementType,
    RadioInput,
    SelectInput,
} from '@gridsuite/commons-ui';
import { useExecuteProcess } from '../hooks/use-execute-process';

const STEP_LABELS = ["Type d'analyse", 'Configuration', 'case'];
const LAST_STEP = STEP_LABELS.length - 1;

const configOptions = Object.values(PROCESS_CONFIG_TYPES);

const elementSelectionSchema = yup.object({
    id: yup.string().required(),
    name: yup.string().required(),
});

const elementField = yup.array().of(elementSelectionSchema).required().length(1);

const fieldSchemas = {
    processType: yup.string().required(),
    debugMode: yup.boolean(),
    configSource: yup.string().oneOf(['configurations', 'reference']).required(),
    processConfig: elementField,
    caseSource: yup.string().oneOf(['auto', 'gridExplore']).required(),
    case: elementField,
};

const validationSchema = yup.object(fieldSchemas);

export type ExecuteProcessConfigFormData = yup.InferType<typeof validationSchema>;

const stepSchemas = [
    yup.object({ processType: fieldSchemas.processType, debugMode: fieldSchemas.debugMode }),
    yup.object({ configSource: fieldSchemas.configSource, processConfig: fieldSchemas.processConfig }),
    yup.object({ caseSource: fieldSchemas.caseSource, case: fieldSchemas.case }),
];

const defaultValues: ExecuteProcessConfigFormData = {
    processType: '',
    debugMode: false,
    configSource: 'configurations',
    processConfig: [],
    caseSource: 'gridExplore',
    case: [],
};

// Fields that must be valid before leaving each step (used with `trigger`)
const STEP_FIELDS: Array<Array<keyof ExecuteProcessConfigFormData>> = [['processType'], ['processConfig'], ['case']];

interface ExecuteProcessConfigDialogProps {
    open: boolean;
    onClose: () => void;
    onLaunch: (url: string) => void;
}

export function ExecuteProcessConfigDialog({ open, onClose, onLaunch }: ExecuteProcessConfigDialogProps) {
    const intl = useIntl();
    const [activeStep, setActiveStep] = useState(0);

    const { executeProcess } = useExecuteProcess();

    const form = useForm<ExecuteProcessConfigFormData>({
        resolver: yupResolver(validationSchema),
        defaultValues,
        // errors re-validate on change, so a failed field clears as soon as the user fixes it
        mode: 'onChange',
    });

    const {
        control,
        trigger,
        getValues,
        reset,
        watch,
        formState: { isValid },
    } = form;

    // re-renders on any field change, so the step validity below stays live
    const values = watch();

    // can the user leave the current step? (checks only the current step's fields,
    // without showing validation errors — the disabled button is the feedback)
    const currentStepIsValid = stepSchemas[activeStep].isValidSync(values);

    const isLastStep = activeStep === LAST_STEP;
    const debugMode = watch('debugMode');
    const processType = watch('processType');
    const processTypeLabel = configOptions.find((option) => option.id === processType)?.label;

    const resetWizard = () => {
        setActiveStep(0);
        reset(defaultValues);
    };

    const handleClose = () => {
        onClose();
        resetWizard();
    };

    const handleBack = () => setActiveStep((step) => Math.max(0, step - 1));

    const handleConfirm = async () => {
        if (isLastStep) {
            if (!(await trigger())) return;
            const result = await executeProcess(getValues());
            onLaunch(result);
            resetWizard();
            return;
        }
        // validate only the current step's fields before advancing
        const stepIsValid = await trigger(STEP_FIELDS[activeStep]);
        if (stepIsValid) {
            setActiveStep((step) => step + 1);
        }
    };

    const alert = (
        <Alert severity="info" sx={{ p: 1 }}>
            <FormattedMessage id="processType" /> :{' '}
            <strong>
                <FormattedMessage id={processTypeLabel} />
            </strong>
        </Alert>
    );

    return (
        <AppDialog
            open={open}
            onClose={handleClose}
            onCancel={handleClose}
            onBack={activeStep > 0 ? handleBack : undefined}
            onConfirm={handleConfirm}
            confirmDisabled={isLastStep ? !isValid : !currentStepIsValid}
            confirmLabel={isLastStep ? intl.formatMessage({ id: 'launch' }) : intl.formatMessage({ id: 'next' })}
            title={<FormattedMessage id="runAnalysisTitle" />}
            chipLabel={debugMode && activeStep !== 0 ? 'debugMode' : undefined}
        >
            <CustomFormProvider {...form} validationSchema={validationSchema}>
                <Box sx={{ width: '100%', mt: 3 }}>
                    <Stepper activeStep={activeStep}>
                        {STEP_LABELS.map((label) => (
                            <Step key={label}>
                                <StepLabel>
                                    <FormattedMessage id={label} />
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <Box sx={{ mt: 3 }}>
                        {activeStep === 0 && (
                            <Stack spacing={2} paddingTop={1}>
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
                        )}

                        {activeStep === 1 && (
                            <Stack spacing={2}>
                                {alert}
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
                                        item?.type === ElementType.PROCESS_CONFIG &&
                                        item?.specificMetadata?.type === processType
                                    }
                                    hideErrorMessage={false}
                                    allowMultiSelect={false}
                                    showPlaceHolder={false}
                                    label="selectConfiguration"
                                    titleId="selectConfiguration"
                                />
                            </Stack>
                        )}

                        {activeStep === 2 && (
                            <Stack spacing={2}>
                                {alert}
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
                        )}
                    </Box>
                </Box>
            </CustomFormProvider>
        </AppDialog>
    );
}

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Stepper, Step, StepLabel } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { AppDialog } from 'shared/ui/AppDialog';
import { CustomFormProvider, PROCESS_CONFIG_TYPES, YUP_REQUIRED } from '@gridsuite/commons-ui';
import { useExecuteProcess } from '../hooks/use-execute-process';
import { CaseStep } from './CaseStep';
import { ProcessConfigStep } from './ProcessConfigStep';
import { ProcessTypeStep } from './ProcessTypeStep';

const STEP_LABELS = ['processType', 'configuration', 'case'];
const LAST_STEP = STEP_LABELS.length - 1;

const configOptions = Object.values(PROCESS_CONFIG_TYPES);

const elementSelectionSchema = yup.object({
    id: yup.string().required(),
    name: yup.string().required(),
});

const elementField = yup.array().of(elementSelectionSchema).required().length(1, YUP_REQUIRED);

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

const STEP_FIELDS: Array<Array<keyof ExecuteProcessConfigFormData>> = [['processType'], ['processConfig'], ['case']];

interface ExecuteProcessConfigDialogProps {
    open: boolean;
    onClose: () => void;
    onLaunch: (url: string) => void;
}

export function ExecuteProcessConfigDialog({ open, onClose, onLaunch }: ExecuteProcessConfigDialogProps) {
    const intl = useIntl();
    const [activeStep, setActiveStep] = useState(0);

    const { executeProcess, isCreating } = useExecuteProcess();

    const form = useForm<ExecuteProcessConfigFormData>({
        resolver: yupResolver(validationSchema),
        defaultValues,
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

    const values = watch();
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
        const stepIsValid = await trigger(STEP_FIELDS[activeStep]);
        if (stepIsValid) {
            setActiveStep((step) => step + 1);
        }
    };

    return (
        <AppDialog
            open={open}
            onClose={handleClose}
            onCancel={handleClose}
            onBack={activeStep > 0 ? handleBack : undefined}
            onConfirm={handleConfirm}
            confirmDisabled={isCreating || (isLastStep ? !isValid : !currentStepIsValid)}
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
                        {activeStep === 0 && <ProcessTypeStep control={control} />}

                        {activeStep === 1 && (
                            <ProcessConfigStep processTypeLabel={processTypeLabel} processType={processType} />
                        )}

                        {activeStep === 2 && <CaseStep processTypeLabel={processTypeLabel} />}
                    </Box>
                </Box>
            </CustomFormProvider>
        </AppDialog>
    );
}

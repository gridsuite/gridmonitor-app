/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { yupResolver } from '@hookform/resolvers/yup';
import {
    CustomFormProvider,
    DescriptionField,
    DirectoryItemInput,
    ElementType,
    FieldConstants,
    Option,
    ParameterLineDirectoryItemsInput,
    ProcessConfigModificationsEdition,
    SelectInput,
    UniqueNameInput,
    ProcessType,
    DirectoryItemSelector,
    directoryItemSchema,
    useSnackMessage,
    ElementAttributes,
} from '@gridsuite/commons-ui';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { useForm, useWatch, type UseFormReturn } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import * as yup from 'yup';
import { AppDialog } from 'shared/ui/AppDialog';
import { UUID } from 'node:crypto';
import { useCreateProcessConfig, useProcessConfigPrefill } from '../hooks/use-create-process-config';

const modificationSelectionSchema = yup.object({
    id: yup.string().required(),
    name: yup.string().required(),
});

const modificationSchema = yup.object({
    modification: yup.array().of(modificationSelectionSchema).required().min(1),

    description: yup.string().optional(),

    active: yup.boolean().optional(),
});

export const formSchema = yup.object({
    processType: yup.string().required(),

    [FieldConstants.NAME]: yup.string().trim().required(),

    [FieldConstants.DESCRIPTION]: yup.string().optional(),

    [FieldConstants.DIRECTORY]: directoryItemSchema.nullable().required(),

    [FieldConstants.MODIFICATIONS]: yup.array().of(modificationSchema).required(),

    [FieldConstants.LOADFLOW_PARAMETERS]: yup
        .array()
        .of(
            yup.object().shape({
                id: yup.string().required(),
                name: yup.string().required(),
            })
        )
        .when('processType', {
            is: (value: unknown) => value === ProcessType.SECURITY_ANALYSIS || value === ProcessType.LOADFLOW,
            then: (schema) => schema.required().length(1, 'formErrorRequiredField'),
            otherwise: (schema) => schema,
        }),

    [FieldConstants.SECURITY_ANALYSIS_PARAMETERS]: yup
        .array()
        .of(
            yup.object().shape({
                id: yup.string().required(),
                name: yup.string().required(),
            })
        )
        .when('processType', {
            is: (value: unknown) => value === ProcessType.SECURITY_ANALYSIS,
            then: (schema) => schema.required().length(1, 'formErrorRequiredField'),
            otherwise: (schema) => schema,
        }),

    [FieldConstants.SHORTCIRCUIT_PARAMETERS]: yup
        .array()
        .of(
            yup.object().shape({
                id: yup.string().required(),
                name: yup.string().required(),
            })
        )
        .when('processType', {
            is: (value: unknown) => value === ProcessType.SHORT_CIRCUIT,
            then: (schema) => schema.required().length(1, 'formErrorRequiredField'),
            otherwise: (schema) => schema,
        }),
});

export type CreateProcessConfigFormValues = yup.InferType<typeof formSchema>;

export const createProcessConfigFormDefaultValues = {
    processType: '',
    [FieldConstants.NAME]: '',
    [FieldConstants.DESCRIPTION]: '',
    [FieldConstants.DIRECTORY]: { directoryItemId: '', directoryItemFullPath: '' },
    [FieldConstants.MODIFICATIONS]: [],
    [FieldConstants.LOADFLOW_PARAMETERS]: [],
    [FieldConstants.SECURITY_ANALYSIS_PARAMETERS]: [],
    [FieldConstants.SHORTCIRCUIT_PARAMETERS]: [],
} satisfies CreateProcessConfigFormValues;

export type ProcessConfigPrefillValues = {
    processType: string;
} & Partial<Omit<CreateProcessConfigFormValues, 'processType'>>;

export type FetchProcessConfigHandler = NonNullable<CreateProcessConfigFormProps['onFetchProcessConfig']>;

type CreateProcessConfigFormProps = {
    form: UseFormReturn<CreateProcessConfigFormValues>;
    onFetchProcessConfig?: (
        processConfigUuid: string,
        elementName?: string,
        elementDescription?: string
    ) => Promise<ProcessConfigPrefillValues | undefined>;
};

export const PROCESS_CONFIG_TYPES = [
    {
        id: ProcessType.SECURITY_ANALYSIS,
        label: 'process_config/securityAnalysis',
    },
    {
        id: ProcessType.LOADFLOW,
        label: 'process_config/loadflow',
    },
    {
        id: ProcessType.SHORT_CIRCUIT,
        label: 'process_config/shortcircuit',
    },
] as const;

function FormSection({ children, id, title }: { children: ReactNode; id: string; title: ReactNode }) {
    return (
        <Stack spacing={2} component="section" aria-labelledby={id}>
            <Typography id={id} variant="h6">
                {title}
            </Typography>

            {children}
        </Stack>
    );
}

function FormSubSection({ children, id, title }: { children: ReactNode; id: string; title: ReactNode }) {
    return (
        <Stack spacing={1.5} component="section" aria-labelledby={id}>
            <Typography id={id} variant="subtitle1" fontWeight={600}>
                {title}
            </Typography>

            {children}
        </Stack>
    );
}

export function CreateProcessConfigForm({ form, onFetchProcessConfig }: CreateProcessConfigFormProps) {
    const intl = useIntl();
    const {
        control,
        formState: { dirtyFields },
    } = form;

    const selectedProcessType = useWatch({
        control,
        name: 'processType',
    });

    const selectedDirectory = useWatch({
        control,
        name: FieldConstants.DIRECTORY,
    });

    const [confirmedProcessType, setConfirmedProcessType] = useState('');
    const [pendingProcessType, setPendingProcessType] = useState<string | null>(null);
    const [openSelectConfigDialog, setOpenSelectConfigDialog] = useState(false);

    const itemFilter = useCallback(
        (filterValue: ElementAttributes) => {
            console.log(filterValue);
            if (
                filterValue?.type === ElementType.PROCESS_CONFIG &&
                filterValue?.specificMetadata?.type === selectedProcessType
            ) {
                return true;
            }
            return false;
        },
        [selectedProcessType]
    );

    useEffect(() => {
        if (!selectedProcessType) {
            setConfirmedProcessType('');
            setPendingProcessType(null);
        }
    }, [selectedProcessType]);

    const checkProcessTypeChange = useCallback(
        (nextValue: Option | null) => {
            const nextProcessType = typeof nextValue === 'string' ? nextValue : (nextValue?.id ?? '');

            if (!nextProcessType) {
                return true;
            }

            if (!confirmedProcessType) {
                setConfirmedProcessType(nextProcessType);
                return true;
            }
            if (nextProcessType === confirmedProcessType) {
                return true;
            }

            const hasTouchedField = Object.keys(dirtyFields).some((fieldName) => fieldName !== 'processType');

            if (!hasTouchedField) {
                return true;
            }

            setPendingProcessType(nextProcessType);
            return false;
        },
        [confirmedProcessType, dirtyFields]
    );

    const cancelProcessTypeChange = () => {
        setPendingProcessType(null);
    };

    const confirmProcessTypeChange = () => {
        if (!pendingProcessType) {
            return;
        }
        form.reset({
            ...createProcessConfigFormDefaultValues,
            processType: pendingProcessType,
        });

        setConfirmedProcessType(pendingProcessType);
        setPendingProcessType(null);
    };

    const handleSelectProcessConfig = async (
        nodes: ReadonlyArray<{ id: string; name?: string; description?: string }>
    ) => {
        setOpenSelectConfigDialog(false);

        const selectedElement = nodes?.[0];
        if (!selectedElement || !onFetchProcessConfig) {
            return;
        }
        const prefillValues = await onFetchProcessConfig(
            selectedElement.id,
            selectedElement.name,
            selectedElement.description
        );

        if (!prefillValues) {
            return;
        }

        const currentDirectory = form.getValues(FieldConstants.DIRECTORY);
        const currentName = form.getValues(FieldConstants.NAME);

        form.reset(
            {
                ...createProcessConfigFormDefaultValues,
                ...prefillValues,
                processType: confirmedProcessType,
                [FieldConstants.NAME]: currentName,
                [FieldConstants.DIRECTORY]: currentDirectory,
            },
            { keepDefaultValues: true }
        );

        setConfirmedProcessType(confirmedProcessType);
        setPendingProcessType(null);
    };

    return (
        <Stack spacing={3} sx={{ paddingTop: 1 }}>
            <SelectInput
                name="processType"
                label={intl.formatMessage({
                    id: 'processType',
                })}
                options={Object.values(PROCESS_CONFIG_TYPES)}
                onCheckNewValue={checkProcessTypeChange}
                fullWidth
                size="small"
            />

            {selectedProcessType !== '' && (
                <Stack spacing={3}>
                    <Divider />

                    <FormSection
                        id="general-information-heading"
                        title={<FormattedMessage id="processConfigGeneralInformation" />}
                    >
                        <Grid container spacing={2}>
                            <UniqueNameInput
                                name={FieldConstants.NAME}
                                label="processConfigName"
                                elementType={ElementType.PROCESS_CONFIG}
                                activeDirectory={selectedDirectory?.directoryItemId as UUID}
                                autoFocus
                                formProps={{ size: 'small' }}
                            />
                            <Grid size={{ xs: 12, sm: 12 }}>
                                <DescriptionField
                                    buttonLabel="AddOptionalDescription"
                                    buttonSx={{ textTransform: 'none' }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 12 }}>
                                <Typography variant="body2" fontWeight={500} gutterBottom>
                                    <FormattedMessage id="processConfigSaveDirectory" />
                                </Typography>

                                <DirectoryItemInput
                                    name={FieldConstants.DIRECTORY}
                                    types={[ElementType.DIRECTORY]}
                                    multiSelect={false}
                                    onlyLeaves={false}
                                    buttonSx={{ textTransform: 'none' }}
                                    validationButtonText={intl.formatMessage({
                                        id: 'validate',
                                    })}
                                    title={intl.formatMessage({
                                        id: 'processConfigSaveDirectory',
                                    })}
                                />
                            </Grid>
                        </Grid>
                    </FormSection>

                    <FormSection
                        id="specific-information-heading"
                        title={
                            <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
                                <Typography variant="h6">
                                    <FormattedMessage id="processConfigSpecificInformation" />
                                </Typography>

                                <Button
                                    variant="outlined"
                                    sx={{ textTransform: 'none' }}
                                    onClick={() => {
                                        setOpenSelectConfigDialog(true);
                                    }}
                                >
                                    <FormattedMessage id="processConfigPrefill" />
                                </Button>
                            </Stack>
                        }
                    >
                        <FormSubSection
                            id="modifications-heading"
                            title={<FormattedMessage id="processConfigModifications" />}
                        >
                            <ProcessConfigModificationsEdition name={FieldConstants.MODIFICATIONS} />
                        </FormSubSection>

                        <FormSubSection
                            id="network-parameters-heading"
                            title={<FormattedMessage id="processConfigNetworkParameters" />}
                        >
                            {(selectedProcessType === ProcessType.SECURITY_ANALYSIS ||
                                selectedProcessType === ProcessType.LOADFLOW) && (
                                <ParameterLineDirectoryItemsInput
                                    label="process_config/loadflow"
                                    elementType={ElementType.LOADFLOW_PARAMETERS}
                                    name={FieldConstants.LOADFLOW_PARAMETERS}
                                    allowMultiSelect={false}
                                    hideErrorMessage={false}
                                />
                            )}

                            {selectedProcessType === ProcessType.SECURITY_ANALYSIS && (
                                <ParameterLineDirectoryItemsInput
                                    label="process_config/securityAnalysis"
                                    elementType={ElementType.SECURITY_ANALYSIS_PARAMETERS}
                                    name={FieldConstants.SECURITY_ANALYSIS_PARAMETERS}
                                    allowMultiSelect={false}
                                    hideErrorMessage={false}
                                />
                            )}

                            {selectedProcessType === ProcessType.SHORT_CIRCUIT && (
                                <ParameterLineDirectoryItemsInput
                                    label="process_config/shortcircuit"
                                    elementType={ElementType.SHORT_CIRCUIT_PARAMETERS}
                                    name={FieldConstants.SHORTCIRCUIT_PARAMETERS}
                                    allowMultiSelect={false}
                                    hideErrorMessage={false}
                                />
                            )}
                        </FormSubSection>
                    </FormSection>
                </Stack>
            )}

            {openSelectConfigDialog && (
                <DirectoryItemSelector
                    open={openSelectConfigDialog}
                    onClose={handleSelectProcessConfig}
                    types={[ElementType.PROCESS_CONFIG]}
                    equipmentTypes={['LOADFLOW']}
                    itemFilter={itemFilter}
                    title={intl.formatMessage({
                        id: 'processConfigPrefill',
                    })}
                    onlyLeaves
                    multiSelect={false}
                    validationButtonText={intl.formatMessage({
                        id: 'validate',
                    })}
                />
            )}

            <Dialog
                open={pendingProcessType !== null}
                onClose={cancelProcessTypeChange}
                disableEscapeKeyDown
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        minWidth: 320,
                    },
                }}
                aria-labelledby="process-type-change-warning-title"
            >
                <DialogTitle id="process-type-change-warning-title">
                    <FormattedMessage id="processConfigProcessTypeChangeTitle" />
                </DialogTitle>

                <DialogContent>
                    <Typography>
                        <FormattedMessage id="processConfigProcessTypeChangeWarning" />
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button variant="text" sx={{ textTransform: 'none' }} onClick={cancelProcessTypeChange}>
                        <FormattedMessage id="cancel" />
                    </Button>

                    <Button variant="contained" sx={{ textTransform: 'none' }} onClick={confirmProcessTypeChange}>
                        <FormattedMessage id="modifier" />
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}

type CreateProcessConfigDialogProps = {
    open: boolean;
    onClose: () => void;
};

export function CreateProcessConfigDialog({ open, onClose }: CreateProcessConfigDialogProps) {
    const form = useForm<CreateProcessConfigFormValues>({
        resolver: yupResolver(formSchema),
        mode: 'onSubmit',
        defaultValues: createProcessConfigFormDefaultValues,
    });

    const { snackSuccess, snackError } = useSnackMessage();

    const { createProcessConfig } = useCreateProcessConfig();

    const onFetchProcessConfig = useProcessConfigPrefill();

    const {
        handleSubmit,
        reset,
        formState: { isValid },
    } = form;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = () => {
        reset(createProcessConfigFormDefaultValues);
        onClose();
    };

    const submit = async () => {
        setIsSubmitting(true);
        try {
            await handleSubmit(async (values) => {
                await createProcessConfig(values);
                snackSuccess({
                    messageId: 'processConfigCreated',
                    messageValues: { folder: values[FieldConstants.DIRECTORY].directoryItemFullPath },
                });
                handleClose();
            })();
        } catch (error) {
            console.log(error);
            snackError({
                messageId: 'processConfigCreateError',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AppDialog
            open={open}
            onClose={handleClose}
            onConfirm={submit}
            confirmDisabled={!isValid || isSubmitting}
            title={<FormattedMessage id="processConfigCreateTitle" />}
        >
            <CustomFormProvider {...form} validationSchema={formSchema}>
                <CreateProcessConfigForm form={form} onFetchProcessConfig={onFetchProcessConfig} />
            </CustomFormProvider>
        </AppDialog>
    );
}

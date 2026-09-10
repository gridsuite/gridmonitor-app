/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldConstants, ProcessType, directoryItemSchema } from '@gridsuite/commons-ui';
import * as yup from 'yup';

export const modificationSelectionSchema = yup.object({
    id: yup.string().required(),
    name: yup.string().required(),
});

export const modificationSchema = yup.object({
    modification: yup.array().of(modificationSelectionSchema).required().min(1),
    description: yup.string().optional(),
    active: yup.boolean().optional(),
});

const parameterSelectionSchema = yup.object({
    id: yup.string().required(),
    name: yup.string().required(),
});

const parametersField = (requiredFor: ProcessType[]) =>
    yup
        .array()
        .of(parameterSelectionSchema)
        .when('processType', {
            is: (value: unknown) => requiredFor.includes(value as ProcessType),
            then: (schema) => schema.required().length(1),
            otherwise: (schema) => schema,
        });

export const formSchema = yup.object({
    processType: yup.string().required(),

    [FieldConstants.NAME]: yup.string().trim().required(),

    [FieldConstants.DESCRIPTION]: yup.string().optional(),

    [FieldConstants.DIRECTORY]: directoryItemSchema.nullable().required(),

    [FieldConstants.MODIFICATIONS]: yup.array().of(modificationSchema).required(),

    [FieldConstants.LOADFLOW_PARAMETERS]: parametersField([ProcessType.SECURITY_ANALYSIS, ProcessType.LOADFLOW]),

    [FieldConstants.SECURITY_ANALYSIS_PARAMETERS]: parametersField([ProcessType.SECURITY_ANALYSIS]),

    [FieldConstants.SHORTCIRCUIT_PARAMETERS]: parametersField([ProcessType.SHORT_CIRCUIT]),
});

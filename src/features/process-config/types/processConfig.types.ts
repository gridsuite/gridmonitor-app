/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UseFormReturn } from 'react-hook-form';
import type { InferType } from 'yup';
import { formSchema } from '../schemas/createProcessConfig.schema';

export type CreateProcessConfigFormValues = InferType<typeof formSchema>;

export type ProcessConfigPrefillValues = { processType: string } & Partial<
    Omit<CreateProcessConfigFormValues, 'processType'>
>;

export type FetchProcessConfigHandler = (
    processConfigUuid: string,
    elementName?: string,
    elementDescription?: string
) => Promise<ProcessConfigPrefillValues | undefined>;

export type CreateProcessConfigFormProps = {
    form: UseFormReturn<CreateProcessConfigFormValues>;
    onFetchProcessConfig?: FetchProcessConfigHandler;
};

export type CreateProcessConfigDialogProps = {
    open: boolean;
    onClose: () => void;
};

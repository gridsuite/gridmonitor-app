/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldConstants, useSnackMessage } from '@gridsuite/commons-ui';
import { useCallback, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { createProcessConfigFormDefaultValues } from '../constants/processConfig.constants';
import type { CreateProcessConfigFormValues } from '../types/processConfig.types';

type UseCreateProcessConfigSubmitParams = {
    form: UseFormReturn<CreateProcessConfigFormValues>;
    createProcessConfig: (values: CreateProcessConfigFormValues) => Promise<unknown>;
    onClose: () => void;
};

export function useCreateProcessConfigSubmit({
    form,
    createProcessConfig,
    onClose,
}: UseCreateProcessConfigSubmitParams) {
    const { snackSuccess, snackError } = useSnackMessage();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = useCallback(async () => {
        setIsSubmitting(true);
        try {
            await form.handleSubmit(async (values) => {
                await createProcessConfig(values);
                snackSuccess({
                    messageId: 'processConfigCreated',
                    messageValues: {
                        folder: values[FieldConstants.DIRECTORY].directoryItemFullPath,
                    },
                });
                form.reset(createProcessConfigFormDefaultValues);
                onClose();
            })();
        } catch {
            snackError({ messageId: 'processConfigCreateError' });
        } finally {
            setIsSubmitting(false);
        }
    }, [form, createProcessConfig, snackSuccess, snackError, onClose]);

    return { submit, isSubmitting };
}

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useExecuteProcessMutation } from 'shared/api/monitor-api';

const executeProcessSchema = z.object({
    caseUuid: z.string().trim().min(1, 'Case UUID is required'),
    processConfigUuid: z.string().trim().min(1, 'Process config UUID is required'),
    isDebug: z.boolean().optional(),
});

export type ExecuteProcessFormValues = z.infer<typeof executeProcessSchema>;

const defaultValues = {
    caseUuid: '',
    processConfigUuid: '',
    isDebug: false,
} satisfies ExecuteProcessFormValues;

export function useExecuteProcess() {
    const form = useForm<ExecuteProcessFormValues>({
        resolver: zodResolver(executeProcessSchema),
        defaultValues,
    });

    const [executeProcess, result] = useExecuteProcessMutation();

    const onSubmit = form.handleSubmit(async (values: ExecuteProcessFormValues) => {
        await executeProcess(values);
    });

    return {
        form,
        onSubmit,
        result,
    };
}

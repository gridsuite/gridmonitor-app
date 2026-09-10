/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Option } from '@gridsuite/commons-ui';
import { useCallback, useEffect, useState } from 'react';
import { useWatch, type UseFormReturn } from 'react-hook-form';
import { createProcessConfigFormDefaultValues } from '../constants/processConfig.constants';
import type { CreateProcessConfigFormValues } from '../types/processConfig.types';

const FIELD_TO_EXCLUDE_FROM_DIRTY_CHECK = 'processType';

export function useProcessTypeGuard(form: UseFormReturn<CreateProcessConfigFormValues>) {
    const {
        control,
        formState: { dirtyFields },
    } = form;

    const selectedProcessType = useWatch({ control, name: 'processType' });

    const [confirmedProcessType, setConfirmedProcessType] = useState('');
    const [pendingProcessType, setPendingProcessType] = useState<string | null>(null);

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

            const hasTouchedField = Object.keys(dirtyFields).some(
                (fieldName) => fieldName !== FIELD_TO_EXCLUDE_FROM_DIRTY_CHECK
            );
            if (!hasTouchedField) {
                return true;
            }

            setPendingProcessType(nextProcessType);
            return false;
        },
        [confirmedProcessType, dirtyFields]
    );

    const cancelProcessTypeChange = useCallback(() => {
        setPendingProcessType(null);
    }, []);

    const confirmProcessTypeChange = useCallback(() => {
        if (!pendingProcessType) {
            return;
        }
        form.reset({
            ...createProcessConfigFormDefaultValues,
            processType: pendingProcessType,
        });
        setConfirmedProcessType(pendingProcessType);
        setPendingProcessType(null);
    }, [form, pendingProcessType]);

    return {
        selectedProcessType,
        pendingProcessType,
        checkProcessTypeChange,
        confirmProcessTypeChange,
        cancelProcessTypeChange,
    };
}

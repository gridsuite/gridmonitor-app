/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { act, renderHook, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FieldConstants, type ProcessConfigFormValues } from '@gridsuite/commons-ui';
import { processConfigValues } from 'test-utils/fixtures';
import { useCreateProcessConfigSubmit } from '../useCreateProcessConfigSubmit';

const mocks = vi.hoisted(() => ({
    snackSuccess: vi.fn(),
    snackError: vi.fn(),
}));

vi.mock('@gridsuite/commons-ui', async (importOriginal) => {
    const original = await importOriginal<typeof import('@gridsuite/commons-ui')>();

    return {
        ...original,
        useSnackMessage: () => ({
            snackSuccess: mocks.snackSuccess,
            snackError: mocks.snackError,
        }),
    };
});

function renderSubmitHook(
    createProcessConfig: (values: ProcessConfigFormValues) => Promise<unknown>,
    onClose: () => void
) {
    return renderHook(() => {
        // Could mock handleSubmit directly to avoid depending on useForm here
        const form = useForm<ProcessConfigFormValues>({ defaultValues: processConfigValues() });
        form.register(FieldConstants.NAME, { required: true });
        return { form, ...useCreateProcessConfigSubmit({ form, createProcessConfig, onClose }) };
    });
}

describe('useCreateProcessConfigSubmit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('reports pending state, then notifies and closes on success', async () => {
        const response = Promise.withResolvers<void>();
        const createProcessConfig = vi.fn(async () => {
            await response.promise;
            return 'created-uuid';
        });
        const onClose = vi.fn();
        const { result } = renderSubmitHook(createProcessConfig, onClose);

        let submission!: Promise<void>;
        await act(async () => {
            submission = result.current.submit();
            await waitFor(() => expect(createProcessConfig).toHaveBeenCalledOnce());
        });
        expect(result.current.isSubmitting).toBe(true);
        expect(onClose).not.toHaveBeenCalled();

        response.resolve();
        await act(async () => submission);
        expect(createProcessConfig).toHaveBeenCalledWith(processConfigValues());
        expect(mocks.snackSuccess).toHaveBeenCalledWith({
            messageId: 'processConfigCreated',
            messageValues: { folder: '/Configurations' },
        });
        expect(mocks.snackError).not.toHaveBeenCalled();
        expect(onClose).toHaveBeenCalledOnce();
        expect(result.current.isSubmitting).toBe(false);
    });

    it('does not create an invalid form', async () => {
        const createProcessConfig = vi.fn(async () => 'created-uuid');
        const onClose = vi.fn();
        const { result } = renderSubmitHook(createProcessConfig, onClose);

        await act(async () => {
            result.current.form.setValue(FieldConstants.NAME, '');
            await result.current.submit();
        });

        expect(createProcessConfig).not.toHaveBeenCalled();
        expect(mocks.snackSuccess).not.toHaveBeenCalled();
        expect(mocks.snackError).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
        expect(result.current.isSubmitting).toBe(false);
    });

    it('notifies on failure and leaves the form open', async () => {
        const createProcessConfig = vi.fn(async () => {
            throw new Error('save failed');
        });
        const onClose = vi.fn();
        const { result } = renderSubmitHook(createProcessConfig, onClose);

        await act(async () => result.current.submit());

        expect(mocks.snackError).toHaveBeenCalledWith({ messageId: 'processConfigCreateError' });
        expect(mocks.snackSuccess).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
        expect(result.current.isSubmitting).toBe(false);
    });
});

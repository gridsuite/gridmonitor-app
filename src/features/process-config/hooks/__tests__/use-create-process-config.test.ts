/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProcessConfigBackend, ProcessConfigFormValues } from '@gridsuite/commons-ui';
import type { CreateProcessConfigApiArg } from 'shared/api/explore-api';
import {
    toCreateProcessConfigApiArg,
    useCreateProcessConfig,
    useProcessConfigPrefill,
} from '../use-create-process-config';

const mocks = vi.hoisted(() => ({
    getProcessConfigBackendFromFormData: vi.fn(),
    getProcessConfigFormData: vi.fn(),
    useCreateProcessConfigMutation: vi.fn(),
    useLazyGetProcessConfigQuery: vi.fn(),
}));

vi.mock('@gridsuite/commons-ui', () => ({
    FieldConstants: {
        NAME: 'name',
        DESCRIPTION: 'description',
        DIRECTORY: 'directory',
    },
    getProcessConfigBackendFromFormData: mocks.getProcessConfigBackendFromFormData,
    getProcessConfigFormData: mocks.getProcessConfigFormData,
}));

vi.mock('shared/api/monitor-api', () => ({
    useLazyGetProcessConfigQuery: mocks.useLazyGetProcessConfigQuery,
}));

vi.mock('shared/api/explore-api', () => ({
    useCreateProcessConfigMutation: mocks.useCreateProcessConfigMutation,
}));

function makeRtkResult<T>(value: T) {
    return {
        unwrap: () => Promise.resolve(value),
    };
}

function makeRtkError(error: unknown) {
    return {
        unwrap: () => Promise.reject(error),
    };
}

const backendPayload = { foo: 'bar' };
const directoryUuid = 'dir-1';
const processConfigUuid = 'pc-1';
const createdUuid = 'created-1';

const fullFormValues = {
    name: 'myConfig',
    description: 'my description',
    directory: { directoryItemId: directoryUuid },
} as unknown as ProcessConfigFormValues;

const expectedApiArg: CreateProcessConfigApiArg = {
    name: 'myConfig',
    description: 'my description',
    parentDirectoryUuid: directoryUuid,
    body: JSON.stringify(backendPayload),
};

describe('toCreateProcessConfigApiArg', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.getProcessConfigBackendFromFormData.mockReturnValue(backendPayload);
    });

    it('should map complete form values to api args', () => {
        const result = toCreateProcessConfigApiArg(fullFormValues);

        expect(mocks.getProcessConfigBackendFromFormData).toHaveBeenCalledTimes(1);
        expect(mocks.getProcessConfigBackendFromFormData).toHaveBeenCalledWith(fullFormValues);
        expect(result).toEqual(expectedApiArg);
    });

    it.each([undefined, null])('should default description %s to empty string', (description) => {
        const result = toCreateProcessConfigApiArg({
            ...fullFormValues,
            description,
        } as unknown as ProcessConfigFormValues);

        expect(result.description).toBe('');
    });

    it.each([undefined, null])('should default directory %s to empty parent uuid', (directory) => {
        const result = toCreateProcessConfigApiArg({
            ...fullFormValues,
            directory,
        } as unknown as ProcessConfigFormValues);

        expect(result.parentDirectoryUuid).toBe('');
    });
});

describe('useCreateProcessConfig', () => {
    const createProcessConfigMutationMock = vi.fn();

    function mockMutationState(state: Record<string, unknown> = {}) {
        mocks.useCreateProcessConfigMutation.mockReturnValue([createProcessConfigMutationMock, state]);
    }

    beforeEach(() => {
        vi.clearAllMocks();
        mocks.getProcessConfigBackendFromFormData.mockReturnValue(backendPayload);
        mockMutationState({ isLoading: false, isError: false });
    });

    it('should expose the mutation state in its idle form', () => {
        const { result } = renderHook(() => useCreateProcessConfig());

        expect(result.current.createProcessConfig).toBeTypeOf('function');
        expect(result.current.isCreating).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(result.current.error).toBeUndefined();
        expect(result.current.createdConfigUuid).toBeUndefined();
    });

    it('should expose isCreating while the mutation is pending', () => {
        mockMutationState({ isLoading: true, isError: false });

        const { result } = renderHook(() => useCreateProcessConfig());

        expect(result.current.isCreating).toBe(true);
        expect(result.current.isError).toBe(false);
    });

    it('should send mapped api args and return the created config uuid on success', async () => {
        mockMutationState({ isLoading: false, isError: false, data: createdUuid });
        createProcessConfigMutationMock.mockReturnValue(makeRtkResult(createdUuid));

        const { result } = renderHook(() => useCreateProcessConfig());

        let created: string | undefined;
        await act(async () => {
            created = await result.current.createProcessConfig(fullFormValues);
        });

        expect(createProcessConfigMutationMock).toHaveBeenCalledTimes(1);
        expect(createProcessConfigMutationMock).toHaveBeenCalledWith(expectedApiArg);
        expect(created).toBe(createdUuid);
        expect(result.current.createdConfigUuid).toBe(createdUuid);
    });

    it('should expose the error when the mutation fails', async () => {
        const error = { status: 500, data: 'boom' };
        mockMutationState({ isLoading: false, isError: true, error });
        createProcessConfigMutationMock.mockReturnValue(makeRtkError(error));

        const { result } = renderHook(() => useCreateProcessConfig());
        expect(result.current.isError).toBe(true);
        expect(result.current.error).toBe(error);

        let caught: unknown;
        await act(async () => {
            try {
                await result.current.createProcessConfig(fullFormValues);
            } catch (e) {
                caught = e;
            }
        });

        expect(caught).toBe(error);
    });

    it('should keep createProcessConfig stable across re-renders', () => {
        const { result, rerender } = renderHook(() => useCreateProcessConfig());
        const first = result.current.createProcessConfig;
        rerender();
        expect(result.current.createProcessConfig).toBe(first);
    });
});

describe('useProcessConfigPrefill', () => {
    const getProcessConfigTriggerMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mocks.useLazyGetProcessConfigQuery.mockReturnValue([getProcessConfigTriggerMock]);
    });

    it('should build form data from the fetched process config', async () => {
        const processConfig = { name: 'fetched' } as unknown as ProcessConfigBackend;
        const formData = { name: 'fetched', description: '' };
        getProcessConfigTriggerMock.mockReturnValue(makeRtkResult({ processConfig }));
        mocks.getProcessConfigFormData.mockReturnValue(formData);

        const { result } = renderHook(() => useProcessConfigPrefill());

        const prefill = await result.current(processConfigUuid);

        expect(getProcessConfigTriggerMock).toHaveBeenCalledTimes(1);
        expect(getProcessConfigTriggerMock).toHaveBeenCalledWith({ uuid: processConfigUuid });
        expect(mocks.getProcessConfigFormData).toHaveBeenCalledTimes(1);
        expect(mocks.getProcessConfigFormData).toHaveBeenCalledWith({ id: processConfigUuid, processConfig }, '', '');
        expect(prefill).toBe(formData);
    });

    it.each([undefined, null])('should return undefined when process config is %s', async (processConfig) => {
        getProcessConfigTriggerMock.mockReturnValue(makeRtkResult({ processConfig }));

        const { result } = renderHook(() => useProcessConfigPrefill());

        expect(await result.current(processConfigUuid)).toBeUndefined();
        expect(mocks.getProcessConfigFormData).not.toHaveBeenCalled();
    });

    it('should propagate the error when the query fails', async () => {
        const error = { status: 404 };
        getProcessConfigTriggerMock.mockReturnValue(makeRtkError(error));

        const { result } = renderHook(() => useProcessConfigPrefill());

        await expect(result.current(processConfigUuid)).rejects.toBe(error);
    });

    it('should keep the prefill handler stable across re-renders', () => {
        const { result, rerender } = renderHook(() => useProcessConfigPrefill());
        const first = result.current;
        rerender();
        expect(result.current).toBe(first);
    });
});

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
    FieldConstants: { NAME: 'name', DESCRIPTION: 'description', DIRECTORY: 'directory' },
    getProcessConfigBackendFromFormData: mocks.getProcessConfigBackendFromFormData,
    getProcessConfigFormData: mocks.getProcessConfigFormData,
}));

vi.mock('shared/api/monitor-api', () => ({
    useLazyGetProcessConfigQuery: mocks.useLazyGetProcessConfigQuery,
}));

vi.mock('shared/api/explore-api', () => ({
    useCreateProcessConfigMutation: mocks.useCreateProcessConfigMutation,
}));

const formValues = {
    name: 'myConfig',
    description: 'my description',
    directory: { directoryItemId: 'directory-uuid' },
} as unknown as ProcessConfigFormValues;

const apiArg: CreateProcessConfigApiArg = {
    name: 'myConfig',
    description: 'my description',
    parentDirectoryUuid: 'directory-uuid',
    body: JSON.stringify({ key: 'value' }),
};

beforeEach(() => {
    vi.clearAllMocks();
    mocks.getProcessConfigBackendFromFormData.mockReturnValue({ key: 'value' });
});

describe('toCreateProcessConfigApiArg', () => {
    it('maps form values to the create API request', () => {
        expect(toCreateProcessConfigApiArg(formValues)).toEqual(apiArg);
    });
});

describe('useCreateProcessConfig', () => {
    it('creates a process configuration from form values', async () => {
        const createMutation = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve('created-uuid') });
        mocks.useCreateProcessConfigMutation.mockReturnValue([createMutation, {}]);

        const { result } = renderHook(() => useCreateProcessConfig());
        let createdConfigUuid: string | undefined;

        await act(async () => {
            createdConfigUuid = await result.current.createProcessConfig(formValues);
        });

        expect(createMutation).toHaveBeenCalledWith(apiArg);
        expect(createdConfigUuid).toBe('created-uuid');
    });
});

describe('useProcessConfigPrefill', () => {
    it('converts a fetched process configuration to form values', async () => {
        const processConfig = { name: 'existing' } as unknown as ProcessConfigBackend;
        const getProcessConfig = vi.fn().mockReturnValue({
            unwrap: () => Promise.resolve({ processConfig }),
        });
        const formData = { name: 'existing' };
        mocks.useLazyGetProcessConfigQuery.mockReturnValue([getProcessConfig]);
        mocks.getProcessConfigFormData.mockReturnValue(formData);

        const { result } = renderHook(() => useProcessConfigPrefill());

        await expect(result.current('process-config-uuid')).resolves.toBe(formData);
        expect(mocks.getProcessConfigFormData).toHaveBeenCalledWith(
            {
                id: 'process-config-uuid',
                processConfig,
            },
            '',
            ''
        );
    });
});

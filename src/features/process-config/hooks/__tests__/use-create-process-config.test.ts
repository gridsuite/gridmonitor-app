/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getProcessConfigBackendFromFormData, getProcessConfigFormData } from '@gridsuite/commons-ui';
import {
    toCreateProcessConfigApiArg,
    useCreateProcessConfig,
    useProcessConfigPrefill,
} from '../use-create-process-config';
import { useCreateProcessConfigSubmit } from '../useCreateProcessConfigSubmit';

const createProcessConfigMutation = vi.fn();
const getProcessConfig = vi.fn();
const snackSuccess = vi.fn();
const snackError = vi.fn();

vi.mock('@gridsuite/commons-ui', () => ({
    FieldConstants: {
        NAME: 'name',
        DESCRIPTION: 'description',
        DIRECTORY: 'directory',
    },
    getProcessConfigBackendFromFormData: vi.fn((values) => ({
        backendValue: values.backendValue,
    })),
    getProcessConfigFormData: vi.fn((args) => ({
        id: args.id,
        processConfig: args.processConfig,
    })),
    useSnackMessage: () => ({
        snackSuccess,
        snackError,
    }),
}));

vi.mock('shared/api/explore-api', () => ({
    useCreateProcessConfigMutation: vi.fn(() => [
        createProcessConfigMutation,
        {
            isLoading: false,
            isError: false,
            error: undefined,
            data: 'created-config-uuid',
        },
    ]),
}));

vi.mock('shared/api/monitor-api', () => ({
    useLazyGetProcessConfigQuery: vi.fn(() => [getProcessConfig]),
}));

describe('use-create-process-config', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('toCreateProcessConfigApiArg', () => {
        it('maps form values to the API argument', () => {
            const values = {
                name: 'Process config',
                description: 'Description',
                directory: {
                    directoryItemId: 'directory-uuid',
                    directoryItemFullPath: '/configs',
                },
                backendValue: 'backend-value',
            } as any;

            expect(toCreateProcessConfigApiArg(values)).toEqual({
                name: 'Process config',
                description: 'Description',
                parentDirectoryUuid: 'directory-uuid',
                body: {
                    backendValue: 'backend-value',
                },
            });

            expect(getProcessConfigBackendFromFormData).toHaveBeenCalledWith(values);
        });

        it('uses empty strings for optional values', () => {
            const values = {
                name: 'Process config',
                description: undefined,
                directory: undefined,
            } as any;

            expect(toCreateProcessConfigApiArg(values)).toEqual({
                name: 'Process config',
                description: '',
                parentDirectoryUuid: '',
                body: {
                    backendValue: undefined,
                },
            });
        });
    });

    describe('useCreateProcessConfig', () => {
        it('creates a process configuration', async () => {
            const unwrap = vi.fn().mockResolvedValue('created-config-uuid');
            createProcessConfigMutation.mockReturnValue({ unwrap });

            const { result } = renderHook(() => useCreateProcessConfig());
            const values = { name: 'Process config' } as any;

            let createdConfig: unknown;

            await act(async () => {
                createdConfig = await result.current.createProcessConfig(values);
            });

            expect(createProcessConfigMutation).toHaveBeenCalledWith({
                name: 'Process config',
                description: '',
                parentDirectoryUuid: '',
                body: {
                    backendValue: undefined,
                },
            });
            expect(unwrap).toHaveBeenCalled();
            expect(createdConfig).toBe('created-config-uuid');
        });

        it('exposes mutation state', () => {
            const { result } = renderHook(() => useCreateProcessConfig());

            expect(result.current.isCreating).toBe(false);
            expect(result.current.isError).toBe(false);
            expect(result.current.error).toBeUndefined();
            expect(result.current.createdConfigUuid).toBe('created-config-uuid');
        });
    });

    describe('useProcessConfigPrefill', () => {
        it('returns form values for an existing process configuration', async () => {
            const processConfig = {
                name: 'Existing config',
            };

            getProcessConfig.mockReturnValue({
                unwrap: vi.fn().mockResolvedValue({ processConfig }),
            });

            const { result } = renderHook(() => useProcessConfigPrefill());

            let prefilledValues: unknown;

            await act(async () => {
                prefilledValues = await result.current('process-config-uuid');
            });

            expect(getProcessConfig).toHaveBeenCalledWith({
                uuid: 'process-config-uuid',
            });
            expect(getProcessConfigFormData).toHaveBeenCalledWith(
                {
                    id: 'process-config-uuid',
                    processConfig,
                },
                '',
                ''
            );
            expect(prefilledValues).toEqual({
                id: 'process-config-uuid',
                processConfig,
            });
        });

        it('returns undefined when the process configuration does not exist', async () => {
            getProcessConfig.mockReturnValue({
                unwrap: vi.fn().mockResolvedValue({ processConfig: undefined }),
            });

            const { result } = renderHook(() => useProcessConfigPrefill());

            let prefilledValues: unknown;

            await act(async () => {
                prefilledValues = await result.current('missing-uuid');
            });

            expect(prefilledValues).toBeUndefined();
            expect(getProcessConfigFormData).not.toHaveBeenCalled();
        });
    });
});

describe('useCreateProcessConfigSubmit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    function createForm(values: any, error?: Error) {
        return {
            handleSubmit: vi.fn((callback: (values: any) => Promise<void>) => async () => {
                if (error) {
                    throw error;
                }

                await callback(values);
            }),
        } as any;
    }

    it('creates the process configuration, shows a success message, and closes the dialog', async () => {
        const values = {
            name: 'Process config',
            directory: {
                directoryItemFullPath: '/configs',
            },
        };

        const form = createForm(values);
        const createProcessConfig = vi.fn().mockResolvedValue(undefined);
        const onClose = vi.fn();

        const { result } = renderHook(() =>
            useCreateProcessConfigSubmit({
                form,
                createProcessConfig,
                onClose,
            })
        );

        await act(async () => {
            await result.current.submit();
        });

        expect(form.handleSubmit).toHaveBeenCalled();
        expect(createProcessConfig).toHaveBeenCalledWith(values);
        expect(snackSuccess).toHaveBeenCalledWith({
            messageId: 'processConfigCreated',
            messageValues: {
                folder: '/configs',
            },
        });
        expect(onClose).toHaveBeenCalled();
        expect(snackError).not.toHaveBeenCalled();
        expect(result.current.isSubmitting).toBe(false);
    });

    it('shows an error when form submission fails', async () => {
        const formError = new Error('Invalid form');
        const form = createForm({}, formError);
        const createProcessConfig = vi.fn();
        const onClose = vi.fn();

        const { result } = renderHook(() =>
            useCreateProcessConfigSubmit({
                form,
                createProcessConfig,
                onClose,
            })
        );

        await act(async () => {
            await result.current.submit();
        });

        expect(createProcessConfig).not.toHaveBeenCalled();
        expect(snackError).toHaveBeenCalledWith({
            messageId: 'processConfigCreateError',
        });
        expect(onClose).not.toHaveBeenCalled();
        expect(result.current.isSubmitting).toBe(false);
    });

    it('shows an error when process configuration creation fails', async () => {
        const values = {
            name: 'Process config',
        };

        const form = createForm(values);
        const createProcessConfig = vi.fn().mockRejectedValue(new Error('Creation failed'));
        const onClose = vi.fn();

        const { result } = renderHook(() =>
            useCreateProcessConfigSubmit({
                form,
                createProcessConfig,
                onClose,
            })
        );

        await act(async () => {
            await result.current.submit();
        });

        expect(snackError).toHaveBeenCalledWith({
            messageId: 'processConfigCreateError',
        });
        expect(onClose).not.toHaveBeenCalled();
        expect(result.current.isSubmitting).toBe(false);
    });
});

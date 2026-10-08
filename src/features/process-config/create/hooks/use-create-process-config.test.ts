/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { FieldConstants } from '@gridsuite/commons-ui';
import { createTestContext } from '../../../../test-utils/create-test-context';
import { processConfigValues } from '../../../../test-utils/fixtures';
import { server } from '../../../../test-utils/msw/server';
import {
    toCreateProcessConfigApiArg,
    useCreateProcessConfig,
    useProcessConfigPrefill,
} from './use-create-process-config';

describe('toCreateProcessConfigApiArg', () => {
    it('maps a typed form to metadata and the serialized backend configuration', () => {
        expect(toCreateProcessConfigApiArg(processConfigValues())).toEqual({
            name: 'Loadflow',
            description: 'A configuration for testing',
            parentDirectoryUuid: 'directory-1',
            body: JSON.stringify({
                processType: 'LOADFLOW',
                modifications: [],
                loadflowParametersUuid: 'parameters-1',
            }),
        });
    });
});

describe('useCreateProcessConfig', () => {
    it('sends the configuration and returns its UUID', async () => {
        let requestReceived: Request | undefined;
        server.use(
            http.post('*/v1/explore/process-configs', ({ request }) => {
                requestReceived = request;
                return HttpResponse.json('created-uuid');
            })
        );
        const { wrapper } = createTestContext();
        const { result } = renderHook(() => useCreateProcessConfig(), { wrapper });

        await act(async () => {
            await expect(result.current.createProcessConfig(processConfigValues())).resolves.toBe('created-uuid');
        });

        expect(requestReceived).toBeDefined();
        const request = requestReceived!;
        expect(Object.fromEntries(new URL(request.url).searchParams)).toEqual({
            name: 'Loadflow',
            description: 'A configuration for testing',
            parentDirectoryUuid: 'directory-1',
        });
        expect(await request.json()).toEqual({
            processType: 'LOADFLOW',
            modifications: [],
            loadflowParametersUuid: 'parameters-1',
        });
        expect(result.current.isCreating).toBe(false);
        expect(result.current.createdConfigUuid).toBe('created-uuid');
    });
});

describe('useProcessConfigPrefill', () => {
    it('fetches a configuration and resolves its parameter names', async () => {
        server.use(
            http.get('*/v1/process-configs/config-1', () =>
                HttpResponse.json({
                    processConfig: {
                        processType: 'LOADFLOW',
                        modifications: [],
                        loadflowParametersUuid: 'parameters-1',
                    },
                })
            ),
            http.get('*/v1/explore/elements/name', () => HttpResponse.json({ 'parameters-1': 'Default parameters' }))
        );
        const { wrapper } = createTestContext();
        const { result } = renderHook(() => useProcessConfigPrefill(), { wrapper });
        await act(async () => {
            await expect(result.current('config-1')).resolves.toMatchObject({
                processType: 'LOADFLOW',
                [FieldConstants.LOADFLOW_PARAMETERS]: [{ id: 'parameters-1', name: 'Default parameters' }],
            });
        });
    });
});

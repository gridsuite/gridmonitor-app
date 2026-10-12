/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { act, renderHook } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { createTestProviders } from 'test-utils/render-with-providers';
import { server } from 'test-utils/msw/server';
import { useGetServersInfos } from '../use-get-servers-infos';

describe('useGetServersInfos', () => {
    it('fetches only on demand, maps module information and requests fresh data on subsequent calls', async () => {
        let requests = 0;
        server.use(
            http.get('*/v1/servers/about', () => {
                requests += 1;
                return HttpResponse.json([
                    { name: 'monitor-server', type: 'server', version: String(requests), gitTag: 'release' },
                    {},
                ]);
            })
        );
        const { wrapper } = createTestProviders();
        const { result, rerender } = renderHook(() => useGetServersInfos(), { wrapper });
        const callback = result.current;

        expect(requests).toBe(0);
        await act(async () => {
            await expect(result.current()).resolves.toEqual([
                { name: 'monitor-server', type: 'server', version: '1', gitTag: 'release' },
                { name: '', type: 'other', version: '', gitTag: '' },
            ]);
        });
        rerender();
        expect(result.current).toBe(callback);

        await act(async () => {
            await expect(result.current()).resolves.toEqual([
                { name: 'monitor-server', type: 'server', version: '2', gitTag: 'release' },
                { name: '', type: 'other', version: '', gitTag: '' },
            ]);
        });
        expect(requests).toBe(2);
    });
});

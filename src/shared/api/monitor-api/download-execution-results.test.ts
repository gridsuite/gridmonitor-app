/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { backendFetchFile } from '@gridsuite/commons-ui';
import { downloadExecutionResultsCsv } from './download-execution-results';

vi.mock('@gridsuite/commons-ui', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@gridsuite/commons-ui')>()),
    backendFetchFile: vi.fn(),
}));

const mockBackendFetchFile = vi.mocked(backendFetchFile);

describe('downloadExecutionResultsCsv', () => {
    beforeEach(() => {
        vi.stubGlobal(
            'URL',
            Object.assign(class MockURL extends URL {}, {
                createObjectURL: vi.fn(() => 'blob:test-result'),
                revokeObjectURL: vi.fn(),
            })
        );
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('posts the export request and downloads the returned file', async () => {
        mockBackendFetchFile.mockResolvedValue(new Blob(['csv data']));
        const createElement = vi.spyOn(document, 'createElement');
        const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

        await downloadExecutionResultsCsv({
            executionId: 'execution/1',
            resultType: 'NMK_CONTINGENCIES',
            sort: ['subjectId,asc', 'limit,desc'],
            filters: '[{"column":"subjectId","value":"LINE_1"}]',
            fileName: 'results.zip',
            csvExportRequest: { headers: ['Equipment'], language: 'en' },
        });

        const [url, request] = mockBackendFetchFile.mock.calls[0];
        expect(url).toContain('/monitor/v1/executions/execution%2F1/results/csv?');
        const query = new URLSearchParams(url.split('?')[1]);
        expect(query.get('resultType')).toBe('NMK_CONTINGENCIES');
        expect(query.getAll('sort')).toEqual(['subjectId,asc', 'limit,desc']);
        expect(query.get('filters')).toBe('[{"column":"subjectId","value":"LINE_1"}]');
        expect(request).toEqual({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ headers: ['Equipment'], language: 'en' }),
        });

        const anchor = createElement.mock.results.find((result) => result.type === 'return')?.value as
            HTMLAnchorElement | undefined;
        expect(anchor).toBeDefined();
        expect(anchor?.download).toBe('results.zip');
        expect(click).toHaveBeenCalledOnce();
        expect(anchor).not.toBeInTheDocument();
        expect(URL.createObjectURL).toHaveBeenCalledOnce();
        expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-result');
    });
});

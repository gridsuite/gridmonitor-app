/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useResultPagination } from '../use-result-pagination';

describe('useResultPagination', () => {
    it('resets the page when filters, subtype, or execution change, retaining page size', () => {
        const { result, rerender } = renderHook(({ key }) => useResultPagination(key), {
            initialProps: { key: 'initial' },
        });
        act(() => result.current.setRowsPerPage(50));
        act(() => result.current.setPage(3));
        expect(result.current.page).toBe(3);
        rerender({ key: 'filtered' });
        expect(result.current.page).toBe(0);
        expect(result.current.rowsPerPage).toBe(50);
        act(() => result.current.setPage(2));
        rerender({ key: 'new-subtype' });
        expect(result.current.page).toBe(0);
        act(() => result.current.setPage(2));
        rerender({ key: 'new-execution' });
        expect(result.current.page).toBe(0);
    });

    it('resets the page when page size changes', () => {
        const { result } = renderHook(() => useResultPagination('initial'));
        act(() => result.current.setPage(4));
        act(() => result.current.setRowsPerPage(100));
        expect(result.current.page).toBe(0);
        expect(result.current.rowsPerPage).toBe(100);
    });
});

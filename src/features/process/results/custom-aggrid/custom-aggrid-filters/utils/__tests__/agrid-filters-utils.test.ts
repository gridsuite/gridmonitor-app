/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { FilterDataTypes } from '@gridsuite/commons-ui';
import { updateAgGridFilters } from '../aggrid-filters-utils';

describe('updateAgGridFilters', () => {
    const setFilterModel = vi.fn();
    const onFilterChanged = vi.fn();
    const getColumns = vi.fn();

    const api = {
        setFilterModel,
        onFilterChanged,
        getColumns,
    } as any;

    const createColumn = (colId: string, visible = true) => ({
        getColId: () => colId,
        isVisible: () => visible,
    });

    beforeEach(() => {
        vi.clearAllMocks();

        getColumns.mockReturnValue([createColumn('processType'), createColumn('status'), createColumn('priority')]);
    });

    describe('when API is not available', () => {
        it('does nothing', () => {
            updateAgGridFilters(undefined, [
                {
                    column: 'status',
                    type: 'equals',
                    dataType: FilterDataTypes.TEXT,
                    value: 'FAILED',
                },
            ]);

            expect(setFilterModel).not.toHaveBeenCalled();
            expect(onFilterChanged).not.toHaveBeenCalled();
        });
    });

    describe('when filters are empty', () => {
        it('clears the filter model when filters are undefined', () => {
            updateAgGridFilters(api, undefined);

            expect(setFilterModel).toHaveBeenCalledWith(null);
            expect(onFilterChanged).not.toHaveBeenCalled();
        });

        it('clears the filter model when filters are empty', () => {
            updateAgGridFilters(api, []);

            expect(setFilterModel).toHaveBeenCalledWith(null);
            expect(onFilterChanged).not.toHaveBeenCalled();
        });
    });

    describe('when filters reference invalid columns', () => {
        it('ignores filters for non-existing columns', () => {
            updateAgGridFilters(api, [
                {
                    column: 'unknownColumn',
                    type: 'equals',
                    dataType: FilterDataTypes.TEXT,
                    value: 'UNKNOWN',
                },
            ]);

            expect(setFilterModel).toHaveBeenCalledWith(null);
            expect(onFilterChanged).not.toHaveBeenCalled();
        });

        it('ignores filters for hidden columns', () => {
            getColumns.mockReturnValue([createColumn('status'), createColumn('processType', false)]);

            updateAgGridFilters(api, [
                {
                    column: 'processType',
                    type: 'equals',
                    dataType: FilterDataTypes.TEXT,
                    value: 'SECURITY_ANALYSIS',
                },
            ]);

            expect(setFilterModel).toHaveBeenCalledWith(null);
            expect(onFilterChanged).not.toHaveBeenCalled();
        });

        it('applies only filters for visible existing columns', () => {
            updateAgGridFilters(api, [
                {
                    column: 'status',
                    type: 'equals',
                    dataType: FilterDataTypes.TEXT,
                    value: 'FAILED',
                },
                {
                    column: 'unknownColumn',
                    type: 'equals',
                    dataType: FilterDataTypes.TEXT,
                    value: 'UNKNOWN',
                },
            ]);

            expect(setFilterModel).toHaveBeenCalledWith({
                status: {
                    type: 'equals',
                    tolerance: undefined,
                    filterType: FilterDataTypes.TEXT,
                    filter: 'FAILED',
                },
            });

            expect(onFilterChanged).toHaveBeenCalledTimes(1);
        });
    });

    describe('single filters', () => {
        it('creates a text filter', () => {
            updateAgGridFilters(api, [
                {
                    column: 'status',
                    type: 'equals',
                    dataType: FilterDataTypes.TEXT,
                    value: 'FAILED',
                },
            ]);

            expect(setFilterModel).toHaveBeenCalledWith({
                status: {
                    type: 'equals',
                    tolerance: undefined,
                    filterType: FilterDataTypes.TEXT,
                    filter: 'FAILED',
                },
            });

            expect(onFilterChanged).toHaveBeenCalledTimes(1);
        });

        it('preserves a number value when it is already a number', () => {
            updateAgGridFilters(api, [
                {
                    column: 'priority',
                    type: 'greaterThan',
                    dataType: FilterDataTypes.NUMBER,
                    value: 42,
                },
            ]);

            expect(setFilterModel).toHaveBeenCalledWith({
                priority: {
                    type: 'greaterThan',
                    tolerance: undefined,
                    filterType: FilterDataTypes.NUMBER,
                    filter: 42,
                },
            });
        });
    });

    describe('enum filters', () => {
        it('creates a customInRange filter for an array value', () => {
            updateAgGridFilters(api, [
                {
                    column: 'processType',
                    type: 'equals',
                    dataType: FilterDataTypes.TEXT,
                    value: ['SECURITY_ANALYSIS', 'LOAD_FLOW'],
                },
            ]);

            expect(setFilterModel).toHaveBeenCalledWith({
                processType: {
                    type: 'customInRange',
                    filterType: 'text',
                    filter: ['SECURITY_ANALYSIS', 'LOAD_FLOW'],
                },
            });

            expect(onFilterChanged).toHaveBeenCalledTimes(1);
        });

        it('creates an empty customInRange filter for an empty array', () => {
            updateAgGridFilters(api, [
                {
                    column: 'processType',
                    type: 'equals',
                    dataType: FilterDataTypes.TEXT,
                    value: [],
                },
            ]);

            expect(setFilterModel).toHaveBeenCalledWith({
                processType: {
                    type: 'customInRange',
                    filterType: 'text',
                    filter: [],
                },
            });
        });
    });

    describe('multiple filters on the same column', () => {
        it('combines filters using OR by default', () => {
            updateAgGridFilters(api, [
                {
                    column: 'status',
                    type: 'equals',
                    dataType: FilterDataTypes.TEXT,
                    value: 'FAILED',
                },
                {
                    column: 'status',
                    type: 'equals',
                    dataType: FilterDataTypes.TEXT,
                    value: 'RUNNING',
                },
            ]);

            expect(setFilterModel).toHaveBeenCalledWith({
                status: {
                    type: 'equals',
                    tolerance: undefined,
                    operator: 'OR',
                    conditions: [
                        {
                            type: 'equals',
                            tolerance: undefined,
                            filterType: FilterDataTypes.TEXT,
                            filter: 'FAILED',
                        },
                        {
                            type: 'equals',
                            tolerance: undefined,
                            filterType: FilterDataTypes.TEXT,
                            filter: 'RUNNING',
                        },
                    ],
                },
            });

            expect(onFilterChanged).toHaveBeenCalledTimes(1);
        });
    });

    describe('multiple columns', () => {
        it('creates independent filter models for different columns', () => {
            updateAgGridFilters(api, [
                {
                    column: 'status',
                    type: 'equals',
                    dataType: FilterDataTypes.TEXT,
                    value: 'FAILED',
                },
                {
                    column: 'priority',
                    type: 'greaterThan',
                    dataType: FilterDataTypes.NUMBER,
                    value: '10',
                },
                {
                    column: 'processType',
                    type: 'equals',
                    dataType: FilterDataTypes.TEXT,
                    value: ['SECURITY_ANALYSIS'],
                },
            ]);

            expect(setFilterModel).toHaveBeenCalledWith({
                status: {
                    type: 'equals',
                    tolerance: undefined,
                    filterType: FilterDataTypes.TEXT,
                    filter: 'FAILED',
                },
                priority: {
                    type: 'greaterThan',
                    tolerance: undefined,
                    filterType: FilterDataTypes.NUMBER,
                    filter: 10,
                },
                processType: {
                    type: 'customInRange',
                    filterType: 'text',
                    filter: ['SECURITY_ANALYSIS'],
                },
            });

            expect(onFilterChanged).toHaveBeenCalledTimes(1);
        });
    });

    describe('AG Grid API interaction', () => {
        it('calls setFilterModel before onFilterChanged', () => {
            const calls: string[] = [];

            setFilterModel.mockImplementation(() => calls.push('setFilterModel'));
            onFilterChanged.mockImplementation(() => calls.push('onFilterChanged'));

            updateAgGridFilters(api, [
                {
                    column: 'status',
                    type: 'equals',
                    dataType: FilterDataTypes.TEXT,
                    value: 'FAILED',
                },
            ]);

            expect(calls).toEqual(['setFilterModel', 'onFilterChanged']);
        });

        it('does not call onFilterChanged when filters are cleared', () => {
            updateAgGridFilters(api, []);

            expect(setFilterModel).toHaveBeenCalledTimes(1);
            expect(onFilterChanged).not.toHaveBeenCalled();
        });

        it('does not call onFilterChanged when all filters are invalid', () => {
            updateAgGridFilters(api, [
                {
                    column: 'unknown',
                    type: 'equals',
                    dataType: FilterDataTypes.TEXT,
                    value: 'test',
                },
            ]);

            expect(setFilterModel).toHaveBeenCalledWith(null);
            expect(onFilterChanged).not.toHaveBeenCalled();
        });
    });
});

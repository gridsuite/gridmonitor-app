/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { describe, expect, it, vi } from 'vitest';
import { IntlShape } from 'react-intl';
import { getActiveColumns, getHistoryColumns } from './ProcessConfigListUtil';

const intl = { formatMessage: ({ id }: { id: string }) => id } as unknown as IntlShape;
const getEnumLabel = (value: string) => value;

describe('ProcessConfigListUtil', () => {
    it('builds active columns including the modify column', () => {
        const columns = getActiveColumns(intl, getEnumLabel, vi.fn());
        expect(columns.map((c) => c.colId)).toEqual([
            'processType',
            'processConfigName',
            'processConfigChangedAt',
            'processConfigChangedBy',
            'modify',
            undefined,
        ]);
    });

    it('builds history columns without the modify column', () => {
        const columns = getHistoryColumns(intl, {}, getEnumLabel);
        const ids = columns.map((c) => c.colId);
        expect(ids).toContain('processType');
        expect(ids).not.toContain('modify');
    });
});

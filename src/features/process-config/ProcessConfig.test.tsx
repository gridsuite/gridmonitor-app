/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { renderWithProviders } from '../../test-utils/render-with-providers';
import { server } from '../../test-utils/msw/server';
import ProcessConfig from './ProcessConfig';

vi.mock('@gridsuite/commons-ui', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@gridsuite/commons-ui')>();
    return {
        ...actual,
        UserAvatar: ({ label }: { label: string }) => <span>{label}</span>,
    };
});

const config = (name: string, processType: string, changedBy: string) => ({
    processConfigUuid: `uuid-${name}`,
    processConfigName: name,
    processType,
    changedAt: '2026-01-01T10:00:00Z',
    changedBy,
});

describe('ProcessConfig page', () => {
    it('displays active and history tables', async () => {
        server.use(
            http.get('*/v1/automatic-process-configs/history', () =>
                HttpResponse.json([config('history-config-name', 'LOADFLOW', 'user-history')])
            ),
            http.get('*/v1/automatic-process-configs', () =>
                HttpResponse.json([config('active-config-name', 'SECURITY_ANALYSIS', 'user-active')])
            )
        );
        renderWithProviders(<ProcessConfig />);
        expect(screen.getByText('Actives')).toBeVisible();
        expect(screen.getByText('History')).toBeVisible();
        expect(await screen.findByText('active-config-name')).toBeInTheDocument();
        expect(await screen.findByText('history-config-name')).toBeInTheDocument();
        expect(screen.getByText('user-active')).toBeInTheDocument();
        expect(screen.getByText('user-history')).toBeInTheDocument();
    });
});

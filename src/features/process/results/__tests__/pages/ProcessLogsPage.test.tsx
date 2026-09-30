/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from 'test-utils/msw/server';
import { renderWithProviders } from 'test-utils/render-with-providers';
import { executionFixture, reportFixture, severitiesFixture } from 'test-utils/fixtures';
import ProcessLogsPage from '../../pages/ProcessLogsPage';

vi.mock('@gridsuite/commons-ui', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@gridsuite/commons-ui')>();
    return {
        ...actual,
        ReportViewer: vi.fn(({ report }) => <div data-testid="report-viewer">Report: {report.id}</div>),
    };
});

describe('ProcessLogsPage', () => {
    it('renders the logs page with report viewer when data is loaded', async () => {
        const execution = executionFixture();
        const report = reportFixture();
        const severities = severitiesFixture();

        server.use(
            http.get('*/v1/executions/execution-1', () => HttpResponse.json(execution)),
            http.get('*/v1/executions/execution-1/reports', () => HttpResponse.json(report)),
            http.get('*/v1/executions/execution-1/reports/aggregated-severities', () => HttpResponse.json(severities)),
            http.get('*/v1/executions/execution-1/logs', () =>
                HttpResponse.json({ content: [], totalElements: 0, totalPages: 0 })
            )
        );

        renderWithProviders(<ProcessLogsPage />, {
            initialEntries: ['/process/results/execution-1/logs'],
        });

        expect(await screen.findByTestId('report-viewer')).toHaveTextContent('Report: report-1');
        expect(screen.getByText('Logs')).toBeVisible();
    });

    it('renders nothing while loading execution', () => {
        server.use(
            http.get('*/v1/executions/execution-1', async () => {
                await new Promise((r) => setTimeout(r, 100));
                return HttpResponse.json(executionFixture());
            })
        );

        renderWithProviders(<ProcessLogsPage />, {
            initialEntries: ['/process/results/execution-1/logs'],
        });

        expect(screen.queryByTestId('report-viewer')).not.toBeInTheDocument();
    });
});

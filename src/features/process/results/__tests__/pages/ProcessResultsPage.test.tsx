/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { createTestContext } from 'test-utils/create-test-context';
import { server } from 'test-utils/msw/server';
import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import { DARK_THEME } from '@gridsuite/commons-ui';
import { getAppTheme } from 'app/config/app-theme';
import ProcessResultsPage from '../../pages/ProcessResultsPage';
import messagesEn from '../../../../../shared/translations/en/common.json';

describe('ProcessResultsPage', () => {
    it('displays process executions successfully', async () => {
        server.use(
            http.get('*/v1/executions', () =>
                HttpResponse.json([
                    {
                        id: 'execution-1',
                        type: 'SECURITY_ANALYSIS',
                        status: 'FAILED',
                        scheduledAt: '2026-01-01T09:55:00Z',
                        startedAt: '2026-01-01T10:00:00Z',
                        completedAt: '2026-01-01T10:05:00Z',
                    },
                ])
            )
        );

        const { wrapper } = createTestContext();

        const { container } = render(
            <IntlProvider locale="en" messages={messagesEn}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={getAppTheme(DARK_THEME)}>
                        <MemoryRouter>
                            <ProcessResultsPage />
                        </MemoryRouter>
                    </ThemeProvider>
                </StyledEngineProvider>
            </IntlProvider>,
            { wrapper }
        );

        await waitFor(() => {
            expect(screen.getByText('Launched process history')).toBeInTheDocument();
        });

        expect(screen.getByText('Refresh')).toBeInTheDocument();

        const rows = await screen.findAllByRole('row');
        expect(rows).toHaveLength(2); // header row + one data row

        const headerTexts = Array.from(container.getElementsByClassName('ag-header-cell-text')) as HTMLElement[];
        const expectedHeaders = ['Type', 'Status', 'Launched by', 'Scheduled', 'Started', 'Terminated', ''];
        headerTexts.forEach((header, index) => {
            expect(header.innerHTML).toBe(expectedHeaders[index]);
        });

        const typeCell = await screen.findByText('Security analysis');
        const statusCell = await screen.findByText('Failed');
        const scheduledAtCell = await screen.findByText('2026-01-01 - 10:55:00');
        const startedAtCell = await screen.findByText('2026-01-01 - 11:00:00');
        const completedAtCell = await screen.findByText('2026-01-01 - 11:05:00');

        expect(typeCell).toBeInTheDocument();
        expect(statusCell).toBeInTheDocument();
        expect(scheduledAtCell).toBeInTheDocument();
        expect(startedAtCell).toBeInTheDocument();
        expect(completedAtCell).toBeInTheDocument();
    });

    it('displays the loading state', async () => {
        server.use(
            http.get('*/v1/executions', async () => {
                await new Promise((resolve) => {
                    setTimeout(resolve, 50);
                });

                return HttpResponse.json([]);
            })
        );

        const { wrapper } = createTestContext();

        render(
            <IntlProvider locale="en" messages={messagesEn}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={getAppTheme(DARK_THEME)}>
                        <MemoryRouter>
                            <ProcessResultsPage />
                        </MemoryRouter>
                    </ThemeProvider>
                </StyledEngineProvider>
            </IntlProvider>,
            { wrapper }
        );

        expect(screen.getByText('Loading process executions...')).toBeInTheDocument();
    });

    it('displays the error state', async () => {
        server.use(http.get('*/v1/executions', () => HttpResponse.error()));

        const { wrapper } = createTestContext();

        render(
            <IntlProvider locale="en" messages={messagesEn}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={getAppTheme(DARK_THEME)}>
                        <MemoryRouter>
                            <ProcessResultsPage />
                        </MemoryRouter>
                    </ThemeProvider>
                </StyledEngineProvider>
            </IntlProvider>,
            { wrapper }
        );

        await waitFor(() => {
            expect(screen.getByText('Unable to load process executions.')).toBeInTheDocument();
        });
    });
});

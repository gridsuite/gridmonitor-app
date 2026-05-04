/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { createTestContext } from 'test-utils/create-test-context';
import { server } from 'test-utils/msw/server';
import ProcessConfigListPage from '../../pages/ProcessConfigListPage';

describe('ProcessConfigListPage', () => {
    it('displays the list successfully', async () => {
        server.use(
            http.get('*/v1/process-configs', () =>
                HttpResponse.json([
                    {
                        id: 'config-1',
                        processConfig: {
                            processType: 'SECURITY_ANALYSIS',
                            securityAnalysisParametersUuid: 'sa-params-1',
                            loadflowParametersUuid: 'loadflow-1',
                            modificationUuids: ['mod-1'],
                        },
                    },
                    {
                        id: 'config-2',
                        processConfig: {
                            processType: 'SECURITY_ANALYSIS',
                            securityAnalysisParametersUuid: 'sa-params-2',
                            loadflowParametersUuid: 'loadflow-2',
                            modificationUuids: [],
                        },
                    },
                ])
            )
        );

        const user = userEvent.setup();
        const { wrapper } = createTestContext();

        render(<ProcessConfigListPage />, { wrapper });

        await waitFor(() => {
            expect(screen.getByText('Security Analysis Configurations')).toBeInTheDocument();
        });

        expect(screen.getByText('2 configurations returned by the API.')).toBeInTheDocument();
        expect(screen.getByText('Config #1')).toBeInTheDocument();
        expect(screen.getByText('Config #2')).toBeInTheDocument();

        await user.click(screen.getAllByRole('button', { name: 'Show raw JSON' })[0]);

        expect(screen.getByText(/"id": "config-1"/)).toBeInTheDocument();
    });

    it('displays the loading state', async () => {
        server.use(
            http.get('*/v1/process-configs', async () => {
                await new Promise((resolve) => {
                    setTimeout(resolve, 50);
                });

                return HttpResponse.json([]);
            })
        );

        const { wrapper } = createTestContext();

        render(<ProcessConfigListPage />, { wrapper });

        expect(screen.getByText('Loading security analysis configurations...')).toBeInTheDocument();
    });

    it('displays the error state', async () => {
        server.use(http.get('*/v1/process-configs', () => HttpResponse.error()));

        const { wrapper } = createTestContext();

        render(<ProcessConfigListPage />, { wrapper });

        await waitFor(() => {
            expect(screen.getByText('Unable to load security analysis configurations.')).toBeInTheDocument();
        });
    });
});

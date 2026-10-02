/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You may obtain one at http://mozilla.org/MPL/2.0/.
 */

import { act, screen } from '@testing-library/react';
import { expect, vi } from 'vitest';
import { ReportFetcherContext } from '@gridsuite/commons-ui';
import { renderWithProviders } from 'test-utils/render-with-providers';
import { ProcessReportViewerProvider } from '../ProcessReportViewerProvider';

const useNotificationsListenerMock = vi.hoisted(() => vi.fn());

vi.mock('@gridsuite/commons-ui', async () => {
    const actual = await vi.importActual<typeof import('@gridsuite/commons-ui')>('@gridsuite/commons-ui');

    return {
        ...actual,
        useNotificationsListener: useNotificationsListenerMock,
    };
});

function RefreshCounterConsumer() {
    return (
        <ReportFetcherContext.Consumer>
            {(value) => <span data-testid="refresh-counter">{value?.refreshCounter}</span>}
        </ReportFetcherContext.Consumer>
    );
}

describe('ProcessReportViewerProvider', () => {
    beforeEach(() => {
        useNotificationsListenerMock.mockImplementation(() => undefined);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('starts with a refresh counter of zero', () => {
        renderWithProviders(
            <ProcessReportViewerProvider executionId="execution-1">
                <RefreshCounterConsumer />
            </ProcessReportViewerProvider>
        );

        expect(screen.getByTestId('refresh-counter')).toHaveTextContent('0');
    });

    it('increments the refresh counter when the current execution receives a process step update', () => {
        let listenerCallback: ((event: MessageEvent) => void) | undefined;

        useNotificationsListenerMock.mockImplementation(
            (_urlKey: unknown, options: { listenerCallbackMessage: (event: MessageEvent) => void }) => {
                listenerCallback = options.listenerCallbackMessage;
            }
        );

        renderWithProviders(
            <ProcessReportViewerProvider executionId="execution-1">
                <RefreshCounterConsumer />
            </ProcessReportViewerProvider>
        );

        act(() => {
            listenerCallback?.({
                data: JSON.stringify({
                    headers: {
                        processExecutionId: 'execution-1',
                        updateType: 'PROCESS_STEP_UPDATED',
                    },
                }),
            } as MessageEvent);
        });

        expect(screen.getByTestId('refresh-counter')).toHaveTextContent('1');
    });

    it('increments the refresh counter when the current execution receives a multiple steps update', () => {
        let listenerCallback: ((event: MessageEvent) => void) | undefined;

        useNotificationsListenerMock.mockImplementation(
            (_urlKey: unknown, options: { listenerCallbackMessage: (event: MessageEvent) => void }) => {
                listenerCallback = options.listenerCallbackMessage;
            }
        );

        renderWithProviders(
            <ProcessReportViewerProvider executionId="execution-1">
                <RefreshCounterConsumer />
            </ProcessReportViewerProvider>
        );

        act(() => {
            listenerCallback?.({
                data: JSON.stringify({
                    headers: {
                        processExecutionId: 'execution-1',
                        updateType: 'PROCESS_STEPS_UPDATED',
                    },
                }),
            } as MessageEvent);
        });

        expect(screen.getByTestId('refresh-counter')).toHaveTextContent('1');
    });

    it('does not refresh when the notification belongs to another execution', () => {
        let listenerCallback: ((event: MessageEvent) => void) | undefined;

        useNotificationsListenerMock.mockImplementation(
            (_urlKey: unknown, options: { listenerCallbackMessage: (event: MessageEvent) => void }) => {
                listenerCallback = options.listenerCallbackMessage;
            }
        );

        renderWithProviders(
            <ProcessReportViewerProvider executionId="execution-1">
                <RefreshCounterConsumer />
            </ProcessReportViewerProvider>
        );

        act(() => {
            listenerCallback?.({
                data: JSON.stringify({
                    headers: {
                        processExecutionId: 'execution-2',
                        updateType: 'PROCESS_STEP_UPDATED',
                    },
                }),
            } as MessageEvent);
        });

        expect(screen.getByTestId('refresh-counter')).toHaveTextContent('0');
    });

    it('does not refresh for unrelated update types', () => {
        let listenerCallback: ((event: MessageEvent) => void) | undefined;

        useNotificationsListenerMock.mockImplementation(
            (_urlKey: unknown, options: { listenerCallbackMessage: (event: MessageEvent) => void }) => {
                listenerCallback = options.listenerCallbackMessage;
            }
        );

        renderWithProviders(
            <ProcessReportViewerProvider executionId="execution-1">
                <RefreshCounterConsumer />
            </ProcessReportViewerProvider>
        );

        act(() => {
            listenerCallback?.({
                data: JSON.stringify({
                    headers: {
                        processExecutionId: 'execution-1',
                        updateType: 'PROCESS_EXECUTION_UPDATED',
                    },
                }),
            } as MessageEvent);
        });

        expect(screen.getByTestId('refresh-counter')).toHaveTextContent('0');
    });

    it('increments the refresh counter independently for consecutive matching notifications', () => {
        let listenerCallback: ((event: MessageEvent) => void) | undefined;

        useNotificationsListenerMock.mockImplementation(
            (_urlKey: unknown, options: { listenerCallbackMessage: (event: MessageEvent) => void }) => {
                listenerCallback = options.listenerCallbackMessage;
            }
        );

        renderWithProviders(
            <ProcessReportViewerProvider executionId="execution-1">
                <RefreshCounterConsumer />
            </ProcessReportViewerProvider>
        );

        act(() => {
            listenerCallback?.({
                data: JSON.stringify({
                    headers: {
                        processExecutionId: 'execution-1',
                        updateType: 'PROCESS_STEP_UPDATED',
                    },
                }),
            } as MessageEvent);
        });

        act(() => {
            listenerCallback?.({
                data: JSON.stringify({
                    headers: {
                        processExecutionId: 'execution-1',
                        updateType: 'PROCESS_STEPS_UPDATED',
                    },
                }),
            } as MessageEvent);
        });

        expect(screen.getByTestId('refresh-counter')).toHaveTextContent('2');
    });
});

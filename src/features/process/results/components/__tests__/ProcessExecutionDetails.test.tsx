/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { ProcessStatus, StepStatus, type ProcessExecution } from 'shared/api/monitor-api';
import messagesEn from '../../../../../shared/translations/en/common.json';
import ProcessExecutionDetails from '../ProcessExecutionDetails';
import type { ProcessStepModel } from '../../models/process-result';

vi.mock('@gridsuite/commons-ui', () => ({
    fetchElementNames: vi.fn().mockResolvedValue({
        'process-config-1': 'Load-flow configuration',
        'case-1': 'Test case',
    }),
    UserAvatar: ({ label }: { label: string }) => <span>{label}</span>,
}));

vi.mock('../../hooks/use-stepper-orientation', () => ({
    useStepperOrientation: () => ({
        containerRef: { current: null },
        orientation: 'horizontal',
    }),
}));

const execution: ProcessExecution = {
    id: 'execution-1',
    type: 'LOADFLOW',
    caseUuid: 'case-1',
    processConfigId: 'process-config-1',
    status: ProcessStatus.Running,
    executionEnvName: 'test',
    scheduledAt: '2026-01-01T09:55:00Z',
    startedAt: '2026-01-01T10:00:00Z',
    completedAt: '2026-01-01T10:05:00Z',
    userId: 'test-user',
};

const steps: ProcessStepModel[] = [
    {
        id: 'step-1',
        stepType: 'LOAD_NETWORK',
        stepOrder: 0,
        status: StepStatus.Completed,
        completedAt: new Date('2026-01-01T09:53:00Z'),
    },
    {
        id: 'step-2',
        stepType: 'APPLY_MODIFICATIONS',
        stepOrder: 1,
        status: StepStatus.Failed,
        startedAt: new Date('2026-01-01T09:53:00Z'),
        completedAt: new Date('2026-01-01T09:53:00Z'),
    },
    {
        id: 'step-3',
        stepType: 'RUN_LF_COMPUTATION',
        stepOrder: 2,
        status: StepStatus.Running,
        startedAt: new Date('2026-01-01T09:54:00Z'),
    },
    {
        id: 'step-4',
        stepType: 'RUN_SA_COMPUTATION',
        stepOrder: 3,
        status: StepStatus.Scheduled,
    },
];

describe('ProcessExecutionDetails', () => {
    it('renders the execution details of a running process', async () => {
        render(
            <IntlProvider locale="en" messages={messagesEn}>
                <MemoryRouter>
                    <ProcessExecutionDetails execution={execution} steps={steps} />
                </MemoryRouter>
            </IntlProvider>
        );

        expect(screen.getAllByText('LoadFlow')[0]).toBeInTheDocument();
        expect(screen.getByText('Running')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Logs' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Compare / Aggregate' })).toBeDisabled();
        expect(screen.getByText('Load case')).toBeInTheDocument();
        expect(screen.getByText('Apply modifications')).toBeInTheDocument();
        expect(screen.getByText('processConfigGeneralInformation')).toBeInTheDocument();
        expect(screen.getByText('Results not available.')).toBeInTheDocument();

        expect(await screen.findByText('Load-flow configuration')).toBeInTheDocument();
        expect(screen.getByText('Test case')).toBeInTheDocument();
    });

    it('renders the execution details of a finished', async () => {
        render(
            <IntlProvider locale="en" messages={messagesEn}>
                <MemoryRouter>
                    <ProcessExecutionDetails
                        execution={{ ...execution, status: ProcessStatus.Completed }}
                        steps={steps}
                    />
                </MemoryRouter>
            </IntlProvider>
        );

        expect(screen.getAllByText('LoadFlow')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Finished')[0]).toBeInTheDocument();
    });

    it('renders the execution details of a failed process', async () => {
        render(
            <IntlProvider locale="en" messages={messagesEn}>
                <MemoryRouter>
                    <ProcessExecutionDetails execution={{ ...execution, status: ProcessStatus.Failed }} steps={steps} />
                </MemoryRouter>
            </IntlProvider>
        );

        expect(screen.getAllByText('LoadFlow')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Failed')[0]).toBeInTheDocument();
    });
});

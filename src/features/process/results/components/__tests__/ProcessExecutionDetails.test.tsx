/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProcessStatus, StepStatus, type ProcessExecution } from 'shared/api/monitor-api';
import { renderWithProviders } from 'test-utils/render-with-providers';
import ProcessExecutionDetails from '../ProcessExecutionDetails';
import type { ProcessStepModel } from '../../models/process-result';

vi.mock('@gridsuite/commons-ui', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@gridsuite/commons-ui')>();
    return {
        ...actual,
        fetchElementNames: vi.fn().mockResolvedValue({
            'process-config-1': 'Load-flow configuration',
            'case-1': 'Test case',
        }),
        UserAvatar: ({ label }: { label: string }) => <span>{label}</span>,
    };
});

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
        renderWithProviders(<ProcessExecutionDetails execution={execution} steps={steps} />);

        expect(screen.getAllByText('LoadFlow')[0]).toBeInTheDocument();
        expect(screen.getByText('Running')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Logs' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Compare / Aggregate' })).toBeDisabled();
        expect(screen.getAllByText('Load case')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Apply modifications')[0]).toBeInTheDocument();
        expect(screen.getByText('General informations')).toBeInTheDocument();
        expect(screen.getByText('Results not available.')).toBeInTheDocument();

        expect(await screen.findByText('Load-flow configuration')).toBeInTheDocument();
        expect(screen.getByText('Test case')).toBeInTheDocument();
    });

    it('renders the execution details of a finished', async () => {
        renderWithProviders(
            <ProcessExecutionDetails execution={{ ...execution, status: ProcessStatus.Completed }} steps={steps} />
        );

        expect(screen.getAllByText('LoadFlow')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Finished')[0]).toBeInTheDocument();
        expect(await screen.findByText('Load-flow configuration')).toBeInTheDocument();
    });

    it('renders the execution details of a failed process', async () => {
        renderWithProviders(
            <ProcessExecutionDetails execution={{ ...execution, status: ProcessStatus.Failed }} steps={steps} />
        );

        expect(screen.getAllByText('LoadFlow')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Failed')[0]).toBeInTheDocument();
        expect(await screen.findByText('Load-flow configuration')).toBeInTheDocument();
    });
});

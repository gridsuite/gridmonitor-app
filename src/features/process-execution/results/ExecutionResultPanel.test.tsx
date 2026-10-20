/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProcessStatus, ProcessType } from 'shared/api/monitor-api';
import { renderWithProviders } from 'test-utils/render-with-providers';
import { ExecutionResultPanel } from './ExecutionResultPanel';

vi.mock('shared/api/monitor-api', async (importOriginal) => {
    const actual = await importOriginal<typeof import('shared/api/monitor-api')>();
    return {
        ...actual,
        ProcessType: {
            Loadflow: 'LOADFLOW',
            SecurityAnalysis: 'SECURITY_ANALYSIS',
            ShortCircuit: 'SHORT_CIRCUIT',
        },
    };
});

vi.mock('./LoadFlowExecutionResult', () => ({
    LoadFlowExecutionResultTable: () => <div data-testid="loadflow-result" />,
}));
vi.mock('./SecurityAnalysisExecutionResult', () => ({
    SecurityAnalysisExecutionResultTable: () => <div data-testid="security-analysis-result" />,
}));
vi.mock('./ShortCircuitExecutionResult', () => ({
    ShortCircuitExecutionResultTable: () => <div data-testid="short-circuit-result" />,
}));

describe('ExecutionResultPanel', () => {
    it.each([
        [ProcessType.Loadflow, 'loadflow-result'],
        [ProcessType.SecurityAnalysis, 'security-analysis-result'],
        [ProcessType.ShortCircuit, 'short-circuit-result'],
    ])('renders the dedicated result component for %s', (processType, testId) => {
        renderWithProviders(
            <ExecutionResultPanel
                executionId="execution-1"
                processType={processType}
                executionStatus={ProcessStatus.Completed}
            />
        );
        expect(screen.getByTestId(testId)).toBeInTheDocument();
    });
});

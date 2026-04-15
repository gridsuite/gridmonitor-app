import { Navigate, Route } from 'react-router';
import { ProcessExecutePage } from '../execute/pages/ProcessExecutePage';
import { ProcessResultsPage } from '../results/pages/ProcessResultsPage';
import { ProcessStepInfosPage } from '../results/pages/ProcessStepInfosPage';

export const processRoutes = (
    <Route path="process">
        <Route index element={<Navigate to="execute" replace />} />
        <Route path="execute" element={<ProcessExecutePage />} />
        <Route path="results">
            <Route index element={<ProcessResultsPage />} />
            <Route path=":id">
                <Route path="step-infos" element={<ProcessStepInfosPage />} />
            </Route>
        </Route>
    </Route>
);

import { Navigate, Route } from 'react-router';
import { ExecutePage } from '../execute/pages/ExecutePage';
import { ResultsPage } from '../results/pages/ResultsPage';

export const processRoutes = (
    <Route path="process">
        <Route index element={<Navigate to="execute" replace />} />
        <Route path="execute" element={<ExecutePage />} />
        <Route path="results" element={<ResultsPage />} />
    </Route>
);

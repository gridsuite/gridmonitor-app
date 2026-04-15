import { Navigate, Route } from 'react-router';
import { ProcessConfigListPage } from '../pages/ProcessConfigListPage';

export const processConfigRoutes = (
    <Route path="process-config">
        <Route index element={<Navigate to="list" replace />} />
        <Route path="list" element={<ProcessConfigListPage />} />
    </Route>
);

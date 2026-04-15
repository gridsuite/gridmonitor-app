import { useGetProcessConfigsQuery } from '../../../../shared/api/monitor-api/monitor.generated';

export function ResultsPage() {
    const { data } = useGetProcessConfigsQuery({ processType: 'SECURITY_ANALYSIS' });

    return JSON.stringify(data);
}

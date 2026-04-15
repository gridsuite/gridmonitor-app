import { useParams } from 'react-router';
import { useGetStepsInfosQuery } from '../../../../shared/api/monitor-api/monitor.generated';

export function ProcessStepInfosPage() {
    const { id } = useParams<{ id: string }>();
    const { data } = useGetStepsInfosQuery({ executionId: id ?? '' });
    return <div>{JSON.stringify(data)}</div>;
}

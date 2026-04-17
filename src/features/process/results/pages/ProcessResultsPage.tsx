import { Link } from 'react-router';
import { Box, Divider, List, ListItem, ListItemText, Paper, Stack, Typography } from '@mui/material';
import { PROCESS_PATHS } from '../../router/process-paths';
import { useGetLaunchedProcessesQuery } from '../../../../shared/api/monitor-api';

export function ProcessResultsPage() {
    const { data: processExecutions = [] } = useGetLaunchedProcessesQuery({ processType: 'SECURITY_ANALYSIS' });

    return (
        <>
            <Typography variant="h5" gutterBottom>
                Process executions ids
            </Typography>
            <Paper>
                <List dense>
                    {processExecutions.map((processExecution) => (
                        <>
                            <ListItem key={processExecution.id}>
                                <ListItemText
                                    primary={
                                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
                                            <Box>
                                                Id :{' '}
                                                <Link to={PROCESS_PATHS.stepInfos(processExecution.id ?? '')}>
                                                    {processExecution.id}
                                                </Link>
                                            </Box>
                                            <Box>
                                                Start : {new Date(processExecution.startedAt ?? '').toLocaleString()}
                                                <Divider />
                                                End : {new Date(processExecution.completedAt ?? '').toLocaleString()}
                                            </Box>
                                        </Stack>
                                    }
                                />
                            </ListItem>
                            <Divider />
                        </>
                    ))}
                </List>
            </Paper>
        </>
    );
}

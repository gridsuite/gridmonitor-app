import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Collapse,
    Divider,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { useGetStepsInfosQuery } from 'shared/api/monitor-api';

type StepStatus = 'SCHEDULED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';

type StepInfo = {
    id?: string;
    stepType?: string;
    stepOrder?: number;
    status?: StepStatus;
    resultId?: string;
    resultType?: 'SECURITY_ANALYSIS';
    reportId?: string;
    startedAt?: string;
    completedAt?: string;
};

function formatDate(value?: string): string {
    if (!value) {
        return 'N/A';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
}

function getStatusColor(status?: StepStatus): 'default' | 'primary' | 'success' | 'error' | 'warning' {
    switch (status) {
        case 'COMPLETED':
            return 'success';
        case 'FAILED':
            return 'error';
        case 'RUNNING':
            return 'warning';
        case 'SCHEDULED':
            return 'primary';
        case 'SKIPPED':
        default:
            return 'default';
    }
}

function FieldRow({ label, value }: { label: string; value?: string | number }) {
    return (
        <Stack spacing={0.5}>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: 'uppercase', letterSpacing: 0.6 }}
            >
                {label}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: value ? 'monospace' : 'inherit', wordBreak: 'break-word' }}>
                {value ?? 'N/A'}
            </Typography>
        </Stack>
    );
}

function StepCard({ step, index }: { step: StepInfo; index: number }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <Card variant="outlined">
            <CardContent>
                <Stack spacing={2}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1.5}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                    >
                        <Stack spacing={0.5}>
                            <Typography variant="h6">Step {step.stepOrder ?? index + 1}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {step.stepType ?? 'Unknown step type'}
                            </Typography>
                        </Stack>
                        <Chip
                            label={step.status ?? 'UNKNOWN'}
                            color={getStatusColor(step.status)}
                            variant="outlined"
                            size="small"
                        />
                    </Stack>

                    <Divider />

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <Box sx={{ flex: 1 }}>
                            <Stack spacing={2}>
                                <FieldRow label="Step Order" value={step.stepOrder} />
                                <FieldRow label="Step Type" value={step.stepType} />
                                <FieldRow label="Step ID" value={step.id} />
                            </Stack>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Stack spacing={2}>
                                <FieldRow label="Started At" value={formatDate(step.startedAt)} />
                                <FieldRow label="Completed At" value={formatDate(step.completedAt)} />
                                <FieldRow label="Result Type" value={step.resultType} />
                            </Stack>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Stack spacing={2}>
                                <FieldRow label="Result ID" value={step.resultId} />
                                <FieldRow label="Report ID" value={step.reportId} />
                            </Stack>
                        </Box>
                    </Stack>

                    <Stack direction="row" justifyContent="flex-end">
                        <Button size="small" onClick={() => setExpanded((previous) => !previous)}>
                            {expanded ? 'Hide raw data' : 'Show raw data'}
                        </Button>
                    </Stack>

                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                bgcolor: 'grey.50',
                                overflowX: 'auto',
                            }}
                        >
                            <Typography
                                component="pre"
                                variant="body2"
                                sx={{
                                    m: 0,
                                    fontFamily: 'monospace',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {JSON.stringify(step, null, 2)}
                            </Typography>
                        </Paper>
                    </Collapse>
                </Stack>
            </CardContent>
        </Card>
    );
}

export function ProcessStepInfosPage() {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading } = useGetStepsInfosQuery({ executionId: id ?? '' }, { skip: !id });

    const sortedSteps = useMemo(() => {
        if (!data) {
            return [];
        }

        return [...data].sort((left, right) => {
            const leftOrder = left.stepOrder ?? Number.MAX_SAFE_INTEGER;
            const rightOrder = right.stepOrder ?? Number.MAX_SAFE_INTEGER;
            return leftOrder - rightOrder;
        });
    }, [data]);

    if (!id) {
        return <Alert severity="warning">No execution ID provided.</Alert>;
    }

    if (isLoading) {
        return (
            <Paper sx={{ p: 3 }}>
                <Typography variant="body1" color="text.secondary">
                    Loading process step information...
                </Typography>
            </Paper>
        );
    }

    if (sortedSteps.length === 0) {
        return <Alert severity="info">No process steps found for this execution.</Alert>;
    }

    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h5" gutterBottom>
                    Process Step Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {sortedSteps.length} step{sortedSteps.length > 1 ? 's' : ''} for execution {id}.
                </Typography>
            </Box>

            <Box
                sx={{
                    maxHeight: '75vh',
                    overflowY: 'auto',
                    pr: { xs: 0, sm: 1 },
                }}
            >
                <Stack spacing={2}>
                    {sortedSteps.map((step, index) => (
                        <StepCard key={step.id ?? `${step.stepOrder ?? 'step'}-${index}`} step={step} index={index} />
                    ))}
                </Stack>
            </Box>
        </Stack>
    );
}

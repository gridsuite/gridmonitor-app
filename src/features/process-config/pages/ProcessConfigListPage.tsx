import { useState } from 'react';
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    Collapse,
    Divider,
    Paper,
    Stack,
    Typography,
    Button,
} from '@mui/material';
import { useGetProcessConfigsQuery } from '../../../shared/api/monitor-api';

function getDisplayValue(value: unknown): string {
    if (value === null || value === undefined || value === '') {
        return 'N/A';
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }

    return 'N/A';
}

function FieldRow({ label, value }: { label: string; value: unknown }) {
    return (
        <Stack spacing={0.5}>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: 'uppercase', letterSpacing: 0.6 }}
            >
                {label}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {getDisplayValue(value)}
            </Typography>
        </Stack>
    );
}

function ArraySection({ label, values }: { label: string; values: string[] }) {
    if (values.length === 0) {
        return null;
    }

    return (
        <Stack spacing={1}>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: 'uppercase', letterSpacing: 0.6 }}
            >
                {label}
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {values.map((value) => (
                    <Chip
                        key={`${value}`}
                        label={value}
                        size="small"
                        variant="outlined"
                        sx={{ maxWidth: '100%', '& .MuiChip-label': { display: 'block', overflowWrap: 'anywhere' } }}
                    />
                ))}
            </Stack>
        </Stack>
    );
}

export function ProcessConfigListPage() {
    const { data, isLoading, isError } = useGetProcessConfigsQuery({ processType: 'SECURITY_ANALYSIS' });
    const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

    if (isLoading) {
        return (
            <Paper sx={{ p: 3 }}>
                <Typography variant="body1" color="text.secondary">
                    Loading security analysis configurations...
                </Typography>
            </Paper>
        );
    }

    if (isError) {
        return <Alert severity="error">Unable to load security analysis configurations.</Alert>;
    }

    if (!data || data.length === 0) {
        return <Alert severity="info">No security analysis configurations found.</Alert>;
    }
    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h5" gutterBottom>
                    Security Analysis Configurations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {data.length} configuration{data.length > 1 ? 's' : ''} returned by the API.
                </Typography>
            </Box>

            {data.map((item, index) => {
                const config = item.processConfig;
                if (!config) {
                    return null;
                }
                const modificationUuids = config.modificationUuids ?? [];
                const expanded = Boolean(expandedItems[index]);

                return (
                    <Card key={item.id} variant="outlined">
                        <CardContent>
                            <Stack spacing={2.5}>
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={1.5}
                                    justifyContent="space-between"
                                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                                >
                                    <Stack spacing={0.5}>
                                        <Typography variant="h6">Config #{index + 1}</Typography>
                                    </Stack>
                                    <Chip
                                        label={getDisplayValue(config.processType)}
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                    />
                                </Stack>
                                <Stack
                                    direction={{ xs: 'column', md: 'row' }}
                                    spacing={2}
                                    divider={
                                        <Divider
                                            flexItem
                                            orientation="vertical"
                                            sx={{ display: { xs: 'none', md: 'block' } }}
                                        />
                                    }
                                >
                                    <Box sx={{ flex: 1 }}>
                                        <Stack spacing={2}>
                                            <FieldRow label="Id" value={item.id} />
                                        </Stack>
                                    </Box>

                                    <Box sx={{ flex: 2 }}>
                                        <Stack spacing={2}>
                                            <FieldRow
                                                label="Security Analysis Parameters UUID"
                                                value={config.securityAnalysisParametersUuid}
                                            />
                                            <FieldRow
                                                label="Loadflow Parameters UUID"
                                                value={config.loadflowParametersUuid}
                                            />
                                        </Stack>
                                    </Box>
                                </Stack>

                                <ArraySection label="Modification UUIDs" values={modificationUuids} />

                                <Stack direction="row" justifyContent="flex-end">
                                    <Button
                                        size="small"
                                        onClick={() =>
                                            setExpandedItems((previous) => ({
                                                ...previous,
                                                [index]: !previous[index],
                                            }))
                                        }
                                    >
                                        {expanded ? 'Hide raw JSON' : 'Show raw JSON'}
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
                                            {JSON.stringify(item, null, 2)}
                                        </Typography>
                                    </Paper>
                                </Collapse>
                            </Stack>
                        </CardContent>
                    </Card>
                );
            })}
        </Stack>
    );
}

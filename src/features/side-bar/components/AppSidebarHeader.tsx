import { Box, Divider, Stack, Typography } from '@mui/material';

export function AppSidebarHeader({ isMinimized }: Readonly<{ isMinimized: boolean }>) {
    return (
        <Stack
            sx={{
                px: isMinimized ? 1 : 2,
                pt: 3,
                flexShrink: 0,
            }}
        >
            <Box
                sx={{
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                }}
            >
                {!isMinimized && (
                    <Typography variant="h6">
                        Grid
                        <Box component="span" sx={{ color: 'primary.main' }}>
                            Monitor
                        </Box>
                    </Typography>
                )}
            </Box>

            {!isMinimized && (
                <Typography
                    variant="caption"
                    sx={{
                        alignSelf: 'flex-end',
                        mb: 0.5,
                    }}
                >
                    V2.0.8
                </Typography>
            )}

            <Divider />
        </Stack>
    );
}

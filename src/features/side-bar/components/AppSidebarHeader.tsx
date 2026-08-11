import { Box, Divider, Stack, Typography } from '@mui/material';
import { Info } from '@mui/icons-material';
import { AboutDialog } from '@gridsuite/commons-ui';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import { APP_NAME } from '../../../app/config/app-config';

export function AppSidebarHeader({ isMinimized }: Readonly<{ isMinimized: boolean }>) {
    const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
    return (
        <>
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

                <Stack
                    width={'100%'}
                    direction={'row'}
                    sx={{
                        alignSelf: 'flex-end',
                        mb: 0.5,
                    }}
                    justifyContent={isMinimized ? 'center' : 'end'}
                    spacing={1}
                >
                    {!isMinimized && <Typography variant="caption">V2.0.8</Typography>}
                    <IconButton onClick={() => setIsAboutDialogOpen(true)}>
                        <Info fontSize={'small'} />
                    </IconButton>
                </Stack>
                <Divider />
            </Stack>
            <AboutDialog open={isAboutDialogOpen} onClose={() => setIsAboutDialogOpen(false)} appName={APP_NAME} />
        </>
    );
}

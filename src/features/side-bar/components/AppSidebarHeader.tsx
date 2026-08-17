import { Box, Divider, Stack, Typography, IconButton } from '@mui/material';
import { Info } from '@mui/icons-material';
import { AboutDialog } from '@gridsuite/commons-ui';
import { useState } from 'react';
import GridmonitorLogo from 'assets/images/gridmonitor_logo.svg?react';
import { APP_NAME } from '../../../app/config/app-config';
import AppPackage from '../../../../package.json';
import { getServersInfos } from '../../top-bar/api/get-servers-infos';
import { fetchVersion } from '../../../shared/config/version';

export function AppSidebarHeader({ isMinimized }: Readonly<{ isMinimized: boolean }>) {
    const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
    return (
        <>
            <Stack
                sx={{
                    px: 1.5,
                    pt: 3,
                }}
            >
                <Stack
                    direction="row"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isMinimized ? 'center' : 'normal',
                    }}
                >
                    <GridmonitorLogo />
                    {!isMinimized && (
                        <Typography variant="h6">
                            Grid
                            <Box component="span" sx={{ color: '#7e57c2' }}>
                                Monitor
                            </Box>
                        </Typography>
                    )}
                </Stack>

                <Stack
                    width="100%"
                    direction="row"
                    sx={{
                        alignSelf: 'flex-end',
                    }}
                    alignItems="center"
                    justifyContent={isMinimized ? 'center' : 'end'}
                    spacing={1}
                >
                    {!isMinimized && <Typography variant="caption">V{AppPackage.version}</Typography>}
                    <IconButton sx={{ paddingX: 0 }} onClick={() => setIsAboutDialogOpen(true)}>
                        <Info fontSize="small" />
                    </IconButton>
                </Stack>
                <Divider />
            </Stack>
            <AboutDialog
                appLicense={AppPackage.license}
                appVersion={AppPackage.version}
                open={isAboutDialogOpen}
                onClose={() => setIsAboutDialogOpen(false)}
                additionalModulesPromise={getServersInfos}
                globalVersionPromise={() => fetchVersion().then((res) => res?.deployVersion ?? 'unknown')}
                appName={APP_NAME}
            />
        </>
    );
}

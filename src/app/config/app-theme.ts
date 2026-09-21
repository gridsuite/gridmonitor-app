/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { LIGHT_THEME } from '@gridsuite/commons-ui';
import { createTheme, Theme } from '@mui/material';

const breakpoints = { xs: 0, sm: 768, md: 900, lg: 1200, xl: 1536 };

const lightTheme: Theme = createTheme({
    palette: {
        mode: 'light',
        processStatus: {
            failed: '#D32F2F',
            running: '#A0F',
            scheduled: '#00838F',
        },
        sidebar: {
            background: '#ECEFF1',
            appName: '#B388FF',
        },
    },
    arrow: {
        fill: '#212121',
        stroke: '#212121',
    },
    arrow_hover: {
        fill: 'white',
        stroke: 'white',
    },
    circle: {
        stroke: 'white',
        fill: 'white',
    },
    circle_hover: {
        stroke: '#212121',
        fill: '#212121',
    },
    link: {
        color: 'blue',
    },
    mapboxStyle: 'mapbox://styles/mapbox/light-v9',
    breakpoints: { values: breakpoints },
    row: {
        color: 'black',
    },
    aggrid: {
        theme: 'ag-theme-alpine',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
});

const darkTheme: Theme = createTheme({
    palette: {
        mode: 'dark',
        processStatus: {
            failed: '#E57373',
            running: '#EA80FC',
            scheduled: '#4DD0E1',
        },
        sidebar: {
            background: '#263238',
            appName: '#7e57c2',
        },
    },
    arrow: {
        fill: 'white',
        stroke: 'white',
    },
    arrow_hover: {
        fill: '#424242',
        stroke: '#424242',
    },
    circle: {
        stroke: '#424242',
        fill: '#424242',
    },
    circle_hover: {
        stroke: 'white',
        fill: 'white',
    },
    link: {
        color: 'green',
    },
    mapboxStyle: 'mapbox://styles/mapbox/dark-v9',
    breakpoints: { values: breakpoints },
    row: {
        color: 'white',
    },
    aggrid: {
        theme: 'ag-theme-alpine-dark',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
});

export const getAppTheme = (theme: string): Theme => (theme === LIGHT_THEME ? lightTheme : darkTheme);

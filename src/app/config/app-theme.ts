/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { LIGHT_THEME } from '@gridsuite/commons-ui';
import { createTheme, Theme } from '@mui/material';
import { blue, common, green, grey, red } from '@mui/material/colors';

function breakPoints(): { values: { xs: number; sm: number } } {
    return {
        values: {
            xs: 0,
            sm: 768,
        },
    };
}

const darkScrollbarStyles = (theme: Theme) => {
    const trackColor = theme.palette.grey[800];
    const thumbColor = theme.palette.grey[500];

    return {
        '*': {
            scrollbarColor: `${thumbColor} ${trackColor}`,

            '&::-webkit-scrollbar': {
                width: '12px',
                height: '12px',
            },

            '&::-webkit-scrollbar-track': {
                backgroundColor: trackColor,
            },

            '&::-webkit-scrollbar-thumb': {
                backgroundColor: thumbColor,
                borderRadius: '8px',
                border: `3px solid ${trackColor}`,
            },
        },
    };
};

const componentsStyleOverrides = () => {
    return {
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
    };
};

const lightTheme: Theme = createTheme({
    palette: {
        mode: 'light',
    },
    arrow: {
        fill: grey[900],
        stroke: grey[900],
    },
    arrow_hover: {
        fill: common.white,
        stroke: common.white,
    },
    circle: {
        stroke: common.white,
        fill: common.white,
    },
    circle_hover: {
        stroke: grey[900],
        fill: grey[900],
    },
    link: {
        color: blue[500],
    },
    mapboxStyle: 'mapbox://styles/mapbox/light-v9',
    breakpoints: breakPoints(),
    row: {
        color: common.black,
    },
    aggrid: {
        theme: 'ag-theme-alpine',
    },
    components: {
        ...componentsStyleOverrides(),
    },
});

const darkTheme: Theme = createTheme({
    palette: {
        mode: 'dark',
        error: {
            main: red[300],
        },
    },
    arrow: {
        fill: common.white,
        stroke: common.white,
    },
    arrow_hover: {
        fill: grey[800],
        stroke: grey[800],
    },
    circle: {
        stroke: grey[800],
        fill: grey[800],
    },
    circle_hover: {
        stroke: common.white,
        fill: common.white,
    },
    link: {
        color: green[500],
    },
    mapboxStyle: 'mapbox://styles/mapbox/dark-v9',
    breakpoints: breakPoints(),
    row: {
        color: common.white,
    },
    aggrid: {
        theme: 'ag-theme-alpine-dark',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: darkScrollbarStyles,
        },
        ...componentsStyleOverrides(),
    },
});

export const getAppTheme = (theme: string): Theme => (theme === LIGHT_THEME ? lightTheme : darkTheme);

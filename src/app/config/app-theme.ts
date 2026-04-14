/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { LIGHT_THEME } from '@gridsuite/commons-ui';
import { createTheme, Theme } from '@mui/material';

const lightTheme: Theme = createTheme({
    palette: {
        mode: 'light',
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
});

const darkTheme: Theme = createTheme({
    palette: {
        mode: 'dark',
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
});

export const getAppTheme = (theme: string): Theme => (theme === LIGHT_THEME ? lightTheme : darkTheme);

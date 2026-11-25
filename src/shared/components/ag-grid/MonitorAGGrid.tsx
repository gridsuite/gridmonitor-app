/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { RefObject, useCallback } from 'react';
import { Box, useTheme } from '@mui/material';
import { yellow } from '@mui/material/colors';
import { CustomAGGrid, CustomAGGridProps, mergeSx } from '@gridsuite/commons-ui';
import { AgGridReact } from 'ag-grid-react';
import { RowStyle } from 'ag-grid-community';
import { AGGRID_LOCALES } from '../../translations/not-intl/aggrid-locales';

type SharedTableGridProps<T> = CustomAGGridProps<T> & {
    gridRef?: RefObject<AgGridReact | null>;
    height?: number | string;
};

export function MonitorAGGrid<T>({
    rowData,
    columnDefs,
    defaultColDef,
    gridRef,
    onGridReady,
    onRowClicked,
    height = '100%',
    sx,
}: Readonly<SharedTableGridProps<T>>) {
    const theme = useTheme();

    const getRowStyle = useCallback((): RowStyle => {
        const style: RowStyle = {
            background: theme.palette.background.default,
            highlightColor: yellow[500],
        };
        return { ...style };
    }, [theme]);

    return (
        <Box sx={mergeSx({ display: 'flex', flexDirection: 'column', height, width: '100%', ml: 1 }, sx)}>
            <CustomAGGrid
                ref={gridRef}
                rowData={rowData}
                defaultColDef={defaultColDef}
                columnDefs={columnDefs}
                overrideLocales={AGGRID_LOCALES}
                onGridReady={onGridReady}
                onRowClicked={onRowClicked}
                onModelUpdated={({ api }) => {
                    if (api.getDisplayedRowCount()) {
                        api.hideOverlay();
                    } else {
                        api.showNoRowsOverlay();
                    }
                }}
                getRowStyle={getRowStyle}
            />
        </Box>
    );
}

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Button } from '@mui/material';

type Props = {
    isLoading: boolean;
};

export function ExecuteProcessActions({ isLoading }: Readonly<Props>) {
    return (
        <Box>
            <Button type="submit" variant="contained" disabled={isLoading}>
                {isLoading ? 'Starting...' : 'Execute process'}
            </Button>
        </Box>
    );
}

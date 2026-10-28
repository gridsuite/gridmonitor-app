/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Button, Typography } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { FormattedMessage, useIntl } from 'react-intl';
import { ProcessHistoryAlert } from './ProcessHistoryAlert';
import { ProcessHistoryTable } from './ProcessHistoryTable';
import { useProcessHistory } from './hooks/use-process-history';
import { CustomAggridReduxProvider } from '../providers/custom-aggrid-redux-provider';

export function ProcessHistory() {
    const intl = useIntl();
    const { executions, isEmpty, isError, isLoading, refresh } = useProcessHistory();

    return (
        <CustomAggridReduxProvider>
            <ProcessHistoryAlert isEmpty={isEmpty} isError={isError} isLoading={isLoading} />
            {!isError && (
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', px: 3 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            ml: 1,
                        }}
                    >
                        <Typography variant="h5" sx={{ mt: 3, mb: 3 }}>
                            <FormattedMessage id="ProcessExecutionHistory" />
                        </Typography>

                        <Button startIcon={<RefreshIcon />} onClick={refresh} variant="outlined" color="primary">
                            {intl.formatMessage({ id: 'Refresh' })}
                        </Button>
                    </Box>
                    <ProcessHistoryTable executions={executions} />
                </Box>
            )}
        </CustomAggridReduxProvider>
    );
}

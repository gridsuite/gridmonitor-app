/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Button, Typography } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { FormattedMessage, useIntl } from 'react-intl';
import { ProcessResultsAlert } from '../components/ProcessResultsAlert';
import { ProcessResultsTable } from '../components/ProcessResultsTable';
import { useProcessResults } from '../hooks/use-process-results';
import { CustomAggridReduxProvider } from '../components/custom-aggrid-redux-provider';

function ProcessResultsPage() {
    const intl = useIntl();
    const { executions, isEmpty, isError, isLoading, refresh } = useProcessResults();

    return (
        <CustomAggridReduxProvider>
            <ProcessResultsAlert isEmpty={isEmpty} isError={isError} isLoading={isLoading} />
            {!isError && (
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', px: '24px' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            ml: 1,
                        }}
                    >
                        <Typography variant="h5" sx={{ mt: '24px', mb: '24px' }}>
                            <FormattedMessage id="ProcessLaunchHistory" />
                        </Typography>

                        <Button
                            startIcon={<RefreshIcon />}
                            onClick={refresh}
                            variant="outlined"
                            color="primary"
                            sx={{ textTransform: 'none' }}
                        >
                            {intl.formatMessage({ id: 'Refresh' })}
                        </Button>
                    </Box>
                    <ProcessResultsTable executions={executions} />
                </Box>
            )}
        </CustomAggridReduxProvider>
    );
}

export default ProcessResultsPage;

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Typography } from '@mui/material';
import { ProcessResultsAlert } from '../components/ProcessResultsAlert';
import { ProcessResultsList } from '../components/ProcessResultsList';
import { useProcessResults } from '../hooks/use-process-results';

function ProcessResultsPage() {
    const { executions, isEmpty, isError, isLoading } = useProcessResults();

    return (
        <>
            <ProcessResultsAlert isEmpty={isEmpty} isError={isError} isLoading={isLoading} />
            {!isLoading && !isError && !isEmpty && (
                <>
                    <Typography variant="h5" gutterBottom>
                        Process executions ids
                    </Typography>
                    <ProcessResultsList executions={executions} />
                </>
            )}
        </>
    );
}

export default ProcessResultsPage;

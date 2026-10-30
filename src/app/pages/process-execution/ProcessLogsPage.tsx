/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useParams } from 'react-router';
import { ProcessLogs } from '../../../features/process-execution/logs/ProcessLogs';

function ProcessLogsPage() {
    const { id } = useParams<{ id: string }>();

    return <ProcessLogs executionId={id} />;
}

export default ProcessLogsPage;

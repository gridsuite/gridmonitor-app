/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';

export function useElapsedTime(startedAt: Date | undefined) {
    const [elapsed, setElapsed] = useState(0);
    const startMs = startedAt ? new Date(startedAt).getTime() : undefined;

    useEffect(() => {
        if (startMs === undefined) {
            setElapsed(0);
            return undefined;
        }
        const updateElapsed = () => setElapsed(Date.now() - startMs);
        const intervalId = window.setInterval(updateElapsed, 1000);
        return () => window.clearInterval(intervalId);
    }, [startMs]);

    return elapsed;
}

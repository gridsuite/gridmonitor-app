/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useRef, useState } from 'react';

const STEP_WIDTH = 232;
const CONNECTOR_MIN_WIDTH = 24;
const GAP = 8;

export function useStepperOrientation(stepCount: number) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');

    useEffect(() => {
        const element = containerRef.current;
        if (!element) {
            return undefined;
        }

        const updateOrientation = (width: number) => {
            const requiredWidth = stepCount * STEP_WIDTH + (stepCount - 1) * (CONNECTOR_MIN_WIDTH + GAP * 2);

            setOrientation(width < requiredWidth ? 'vertical' : 'horizontal');
        };

        const observer = new ResizeObserver(([entry]) => {
            updateOrientation(entry.contentRect.width);
        });

        observer.observe(element);

        return () => observer.disconnect();
    }, [stepCount]);

    return { containerRef, orientation };
}

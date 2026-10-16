/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useLayoutEffect, useRef, useState } from 'react';

export function useStepperOrientation() {
    const containerRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('vertical');

    useLayoutEffect(() => {
        const container = containerRef.current;
        const measure = measureRef.current;
        if (!container || !measure || typeof ResizeObserver === 'undefined') {
            return undefined;
        }

        const updateOrientation = () => {
            const fits = measure.getBoundingClientRect().width <= container.getBoundingClientRect().width;
            setOrientation(fits ? 'horizontal' : 'vertical');
        };
        const observer = new ResizeObserver(updateOrientation);
        observer.observe(container);
        observer.observe(measure);
        updateOrientation();

        return () => observer.disconnect();
    }, []);

    return { containerRef, measureRef, orientation };
}

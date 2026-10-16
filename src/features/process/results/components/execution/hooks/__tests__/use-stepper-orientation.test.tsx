/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { act, render, renderHook, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useStepperOrientation } from '../use-stepper-orientation';

class MockResizeObserver implements ResizeObserver {
    static latest: MockResizeObserver | undefined;

    readonly observedElements: Element[] = [];

    readonly unobservedElements: Element[] = [];

    disconnected = false;

    constructor(private readonly callback: ResizeObserverCallback) {
        MockResizeObserver.latest = this;
    }

    observe(target: Element) {
        this.observedElements.push(target);
    }

    unobserve(target: Element) {
        this.unobservedElements.push(target);
    }

    disconnect() {
        this.disconnected = true;
    }

    notify() {
        this.callback([], this);
    }
}

function StepperOrientationTestComponent() {
    const { containerRef, measureRef, orientation } = useStepperOrientation();

    return (
        <>
            <div data-testid="stepper-container" ref={containerRef} />
            <div data-testid="stepper-measure" ref={measureRef} />
            <span>{orientation}</span>
        </>
    );
}

afterEach(() => {
    vi.unstubAllGlobals();
    MockResizeObserver.latest = undefined;
});

describe('useStepperOrientation', () => {
    it('keeps the default vertical orientation when its refs are not mounted', () => {
        vi.stubGlobal('ResizeObserver', MockResizeObserver);
        const { result } = renderHook(() => useStepperOrientation());

        expect(result.current.orientation).toBe('vertical');
        expect(MockResizeObserver.latest).toBeUndefined();
    });

    it('keeps the vertical orientation when ResizeObserver is unavailable', () => {
        vi.stubGlobal('ResizeObserver', undefined);
        render(<StepperOrientationTestComponent />);

        expect(screen.getByText('vertical')).toBeInTheDocument();
    });

    it('updates orientation from measured widths and disconnects on unmount', () => {
        vi.stubGlobal('ResizeObserver', MockResizeObserver);
        const { unmount } = render(<StepperOrientationTestComponent />);
        const container = screen.getByTestId('stepper-container');
        const measure = screen.getByTestId('stepper-measure');
        const containerBounds = vi.spyOn(container, 'getBoundingClientRect');
        const measureBounds = vi.spyOn(measure, 'getBoundingClientRect');
        const observer = MockResizeObserver.latest;

        if (!observer) {
            throw new Error('Expected ResizeObserver to be created');
        }

        containerBounds.mockReturnValue(new DOMRect(0, 0, 300, 100));
        measureBounds.mockReturnValue(new DOMRect(0, 0, 301, 100));
        expect(observer.observedElements).toEqual([container, measure]);

        act(() => observer.notify());
        expect(screen.getByText('vertical')).toBeInTheDocument();

        measureBounds.mockReturnValue(new DOMRect(0, 0, 300, 100));
        act(() => observer.notify());
        expect(screen.getByText('horizontal')).toBeInTheDocument();

        unmount();
        expect(observer.disconnected).toBe(true);
    });
});

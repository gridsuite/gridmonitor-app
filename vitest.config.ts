/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: 'jsdom',
            globals: true,
            setupFiles: './vitest.setup.ts',
            css: true,
            server: {
                deps: {
                    inline: ['@gridsuite/commons-ui'],
                },
            },
            coverage: {
                reporter: ['text', 'lcov'],
            },
        },
    })
);

/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { defineConfig } from 'vitest/config';
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import viteConfig from './vite.config';

export default defineConfig({
    // esbuild handles TSX; app-only React Compiler and checker plugins are unnecessary here.
    plugins: [svgr(), tsconfigPaths()],
    resolve: viteConfig.resolve,
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './vitest.setup.ts',
        css: true,
        clearMocks: true,
        restoreMocks: true,
        // Reuse dependency initialization; setup resets application modules between files.
        pool: 'threads',
        maxWorkers: 1,
        isolate: false,
        deps: {
            optimizer: {
                client: {
                    enabled: true,
                    include: ['@gridsuite/commons-ui', 'react-router', '@mui/material', '@mui/icons-material'],
                    exclude: [
                        'react',
                        'react-dom',
                        'react-redux',
                        'react-intl',
                        '@emotion/react',
                        '@emotion/styled',
                        'uuid',
                        'react-window',
                    ],
                },
            },
        },
        coverage: {
            reporter: ['text', 'lcov'],
            include: ['src/**/*.{ts,tsx}'],
            exclude: [
                '**/*.test.ts',
                '**/*.test.tsx',
                '**/*.spec.ts',
                '**/*.spec.tsx',
                '**/__tests__/**',
                'src/test-utils/**',
                'src/**/*.generated.ts',
                'src/types/**',
                'src/**/*.d.ts',
                'src/**/*.type.ts',
            ],
        },
    },
});

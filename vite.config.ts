/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import react from '@vitejs/plugin-react';
import path from 'path';
import { CommonServerOptions, defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const serverSettings: CommonServerOptions = {
    port: 3000, // TODO: override with actual port
    proxy: {
        '/api/gateway': {
            target: 'http://localhost:9000',
            rewrite: (url: string) => url.replace(/^\/api\/gateway/, ''),
        },
        '/ws/gateway': {
            target: 'http://localhost:9000',
            rewrite: (url: string) => url.replace(/^\/ws\/gateway/, ''),
            ws: true,
        },
    },
};

export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        checker({
            // TypeScript checking
            typescript: true,

            // ESLint checking
            eslint: {
                useFlatConfig: true,
                lintCommand: 'eslint . --max-warnings 0',
                dev: {
                    logLevel: ['error', 'warning'],
                },
                watchPath: './src',
            },

            overlay: false, // Disable overlay in browser

            // Show errors in terminal
            terminal: true,

            // Disable during build because vite-plugin-checker runs checks in a parallel worker,
            // which doesn't block the build if linting or type checking fails. To ensure build
            // failure on errors, we use the 'prebuild' script instead (runs before 'npm run build').
            enableBuild: false,
        }),
        svgr(), // works on every import with the pattern "**/*.svg?react"
        tsconfigPaths(), // to resolve absolute path via tsconfig cf https://stackoverflow.com/a/68250175/5092999
    ],
    base: './',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            assets: path.resolve(__dirname, './src/assets'),
        },
    },
    server: serverSettings, // for npm run start
    preview: serverSettings, // for npm run serve (use local build)
    build: {
        outDir: 'build',
    },
});

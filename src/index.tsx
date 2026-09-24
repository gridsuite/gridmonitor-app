/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import './configure-yup-init';
import 'typeface-roboto';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './app/styles/index.css';
import AppWrapper from './app/providers/AppProviders';

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <AppWrapper />
        </React.StrictMode>
    );
} else {
    const errorMessage = document.createElement('b');
    errorMessage.textContent = "Can't start the application...";
    document.body.append(errorMessage);
    throw new Error('No root container found');
}

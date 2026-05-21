/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { configureParams, TokenSelector } from 'shared/config/config-params';
import { selectToken } from 'features/authentication/store/authentication.selectors';

const APP_NAME = 'monitor';
configureParams({ appName: APP_NAME, tokenSelector: selectToken as TokenSelector });

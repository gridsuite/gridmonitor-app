/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FormControlLabel, Switch } from '@mui/material';
import type { ChangeEvent } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import { APP_PATHS } from 'app/router/app-paths';
import { PROCESS_PATHS } from 'features/process/router/process-paths';

export function ConfigurationModeToggle({ isConfigurationMode }: { readonly isConfigurationMode: boolean }) {
    const intl = useIntl();
    const navigate = useNavigate();

    const handleToggle = (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        navigate(checked ? PROCESS_PATHS.execute : APP_PATHS.home, { replace: true });
    };

    return (
        <FormControlLabel
            control={<Switch checked={isConfigurationMode} onChange={handleToggle} />}
            label={intl.formatMessage({ id: 'configurationMode' })}
            labelPlacement="start"
            sx={{ mx: 0, flexShrink: 0, whiteSpace: 'nowrap' }}
        />
    );
}

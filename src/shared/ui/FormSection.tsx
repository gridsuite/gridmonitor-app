/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type FormSectionProps = {
    children: ReactNode;
    id: string;
    title: ReactNode;
};

export function FormSection({ children, id, title }: FormSectionProps) {
    return (
        <Stack spacing={2} component="section" aria-labelledby={id}>
            <Typography id={id} variant="h6">
                {title}
            </Typography>
            {children}
        </Stack>
    );
}

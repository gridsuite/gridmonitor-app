/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Button, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { FormSection } from 'shared/ui/FormSection';
import { Control } from 'react-hook-form';
import { ModificationsSubSection } from './ModificationsSubSection';
import { NetworkParametersSubSection } from './NetworkParametersSubSection';
import { CreateProcessConfigFormValues } from '../types/processConfig.types';

type SpecificInformationSectionProps = {
    onPrefill: () => void;
    control: Control<CreateProcessConfigFormValues>;
};

export function SpecificInformationSection({ onPrefill, control }: SpecificInformationSectionProps) {
    return (
        <FormSection
            id="specific-information-heading"
            title={
                <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
                    <Typography variant="h6">
                        <FormattedMessage id="processConfigSpecificInformation" />
                    </Typography>
                    <Button variant="outlined" sx={{ textTransform: 'none' }} onClick={onPrefill}>
                        <FormattedMessage id="processConfigPrefill" />
                    </Button>
                </Stack>
            }
        >
            <ModificationsSubSection />
            <NetworkParametersSubSection control={control} />
        </FormSection>
    );
}

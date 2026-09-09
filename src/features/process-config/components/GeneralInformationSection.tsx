/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    DescriptionField,
    DirectoryItemInput,
    ElementType,
    FieldConstants,
    UniqueNameInput,
} from '@gridsuite/commons-ui';
import { Grid, Typography } from '@mui/material';
import { UUID } from 'node:crypto';
import { FormattedMessage, useIntl } from 'react-intl';
import { FormSection } from 'shared/ui/FormSection';

type GeneralInformationSectionProps = {
    directoryId: string | undefined;
};

export function GeneralInformationSection({ directoryId }: GeneralInformationSectionProps) {
    const intl = useIntl();

    return (
        <FormSection id="general-information-heading" title={<FormattedMessage id="processConfigGeneralInformation" />}>
            <Grid container spacing={2}>
                <UniqueNameInput
                    name={FieldConstants.NAME}
                    label="processConfigName"
                    elementType={ElementType.PROCESS_CONFIG}
                    activeDirectory={directoryId as UUID}
                    autoFocus
                    formProps={{ size: 'small' }}
                />

                <Grid size={{ xs: 12, sm: 12 }}>
                    <DescriptionField buttonLabel="AddOptionalDescription" buttonSx={{ textTransform: 'none' }} />
                </Grid>

                <Grid size={{ xs: 12, sm: 12 }}>
                    <Typography variant="body2" fontWeight={500} gutterBottom>
                        <FormattedMessage id="processConfigSaveDirectory" />
                    </Typography>
                    <DirectoryItemInput
                        name={FieldConstants.DIRECTORY}
                        types={[ElementType.DIRECTORY]}
                        multiSelect={false}
                        onlyLeaves={false}
                        buttonSx={{ textTransform: 'none' }}
                        validationButtonText={intl.formatMessage({ id: 'validate' })}
                        title={intl.formatMessage({ id: 'processConfigSaveDirectory' })}
                    />
                </Grid>
            </Grid>
        </FormSection>
    );
}

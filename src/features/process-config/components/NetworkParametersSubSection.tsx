/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ElementType, FieldConstants, ParameterLineDirectoryItemsInput, ProcessType } from '@gridsuite/commons-ui';
import { Control, useWatch } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { FormSubSection } from 'shared/ui/FormSubSection';
import type { CreateProcessConfigFormValues } from '../types/processConfig.types';

const commonDirectoryItemsInputProps = {
    allowMultiSelect: false,
    hideErrorMessage: false,
    labelGridSize: 4,
    inputGridSize: 8,
    showPlaceHolder: true,
};

export function NetworkParametersSubSection({ control }: { control: Control<CreateProcessConfigFormValues> }) {
    const selectedProcessType = useWatch({ control, name: 'processType' });

    return (
        <FormSubSection
            id="network-parameters-heading"
            title={<FormattedMessage id="processConfigNetworkParameters" />}
        >
            {(selectedProcessType === ProcessType.SECURITY_ANALYSIS ||
                selectedProcessType === ProcessType.LOADFLOW) && (
                <ParameterLineDirectoryItemsInput
                    label="process_config/loadflow"
                    elementType={ElementType.LOADFLOW_PARAMETERS}
                    name={FieldConstants.LOADFLOW_PARAMETERS}
                    {...commonDirectoryItemsInputProps}
                />
            )}

            {selectedProcessType === ProcessType.SECURITY_ANALYSIS && (
                <ParameterLineDirectoryItemsInput
                    label="process_config/securityAnalysis"
                    elementType={ElementType.SECURITY_ANALYSIS_PARAMETERS}
                    name={FieldConstants.SECURITY_ANALYSIS_PARAMETERS}
                    {...commonDirectoryItemsInputProps}
                />
            )}

            {selectedProcessType === ProcessType.SHORT_CIRCUIT && (
                <ParameterLineDirectoryItemsInput
                    label="process_config/shortcircuit"
                    elementType={ElementType.SHORT_CIRCUIT_PARAMETERS}
                    name={FieldConstants.SHORTCIRCUIT_PARAMETERS}
                    {...commonDirectoryItemsInputProps}
                />
            )}
        </FormSubSection>
    );
}

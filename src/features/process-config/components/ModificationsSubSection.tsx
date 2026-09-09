/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldConstants, ProcessConfigModificationsEdition } from '@gridsuite/commons-ui';
import { FormattedMessage } from 'react-intl';
import { FormSubSection } from 'shared/ui/FormSubSection';

export function ModificationsSubSection() {
    return (
        <FormSubSection id="modifications-heading" title={<FormattedMessage id="processConfigModifications" />}>
            <ProcessConfigModificationsEdition name={FieldConstants.MODIFICATIONS} />
        </FormSubSection>
    );
}

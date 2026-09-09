/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { DirectoryItemSelector, ElementType, type ElementAttributes } from '@gridsuite/commons-ui';
import { useIntl } from 'react-intl';

type PrefillConfigSelectorProps = {
    open: boolean;
    types?: string[];
    onClose: (nodes: ReadonlyArray<{ id: string; name?: string; description?: string }>) => void;
    itemFilter: (item: ElementAttributes) => boolean;
};

export function PrefillConfigSelector({ open, types, onClose, itemFilter }: PrefillConfigSelectorProps) {
    const intl = useIntl();

    return (
        <DirectoryItemSelector
            open={open}
            onClose={onClose}
            types={[ElementType.PROCESS_CONFIG]}
            equipmentTypes={types}
            itemFilter={itemFilter}
            title={intl.formatMessage({ id: 'processConfigPrefill' })}
            onlyLeaves
            multiSelect={false}
            validationButtonText={intl.formatMessage({ id: 'validate' })}
        />
    );
}

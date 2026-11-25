/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useIntl } from 'react-intl';
import { useCallback, useMemo, useState } from 'react';
import { AutomaticProcessConfigInfos, ProcessType } from '../../../shared/api/monitor-api';
import { getActiveColumns } from './ProcessConfigListUtil';
import { ChangeAutomaticProcessConfigDialog } from './ChangeAutomaticProcessConfigDialog';
import { ProcessConfigEnumsType } from './ProcessConfigTable.constants';
import { MonitorAGGrid } from '../../../shared/components/ag-grid/MonitorAGGrid';
import { BASE_DEFAULT_COL_DEF } from '../../../shared/components/ag-grid/ag-grid-default-col-def';
import { useEnumLabel } from '../../../shared/hooks/use-enum-label';

type ActiveProcessConfigTableProps = {
    configs: AutomaticProcessConfigInfos[];
};

const DEFAULT_COL_DEF = { ...BASE_DEFAULT_COL_DEF, suppressMovable: true };

export function ActiveProcessConfigTable({ configs }: Readonly<ActiveProcessConfigTableProps>) {
    const intl = useIntl();
    const getEnumLabel = useEnumLabel();
    const [editedProcessType, setEditedProcessType] = useState<ProcessType | undefined>();

    const handleModify = useCallback((config: AutomaticProcessConfigInfos) => {
        setEditedProcessType(config.processType);
    }, []);

    const columns = useMemo(
        () => getActiveColumns(intl, ProcessConfigEnumsType, getEnumLabel, handleModify),
        [intl, getEnumLabel, handleModify]
    );

    return (
        <>
            <MonitorAGGrid rowData={configs} columnDefs={columns} defaultColDef={DEFAULT_COL_DEF} height={300} />
            {editedProcessType && (
                <ChangeAutomaticProcessConfigDialog
                    open
                    processType={editedProcessType}
                    onClose={() => setEditedProcessType(undefined)}
                />
            )}
        </>
    );
}

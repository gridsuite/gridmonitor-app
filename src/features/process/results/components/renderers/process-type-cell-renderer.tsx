/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useIntl } from 'react-intl';
import { Link } from 'react-router';
import { PROCESS_PATHS } from '../../../router/process-paths';

export type ProcessTypeCellRendererProps = { value: string; id: string };

export function ProcessTypeCellRenderer({ value, id }: Readonly<ProcessTypeCellRendererProps>) {
    const intl = useIntl();

    const linkStyle = {
        color: 'inherit',
        textDecoration: 'none',
    };
    return (
        <Link to={PROCESS_PATHS.stepInfos(id ?? '')} onClick={(event) => event.stopPropagation()} style={linkStyle}>
            {intl.formatMessage({ id: value })}
        </Link>
    );
}

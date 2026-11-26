/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { IntlProvider } from 'react-intl';
import { ConfigModifyCellRenderer, ConfigModifyCellRendererParams } from './config-modify-cell-renderer';
import { ConfigUserCellRenderer } from './config-user-cell-renderer';

vi.mock('@gridsuite/commons-ui', () => ({
    UserAvatar: ({ label }: { label: string }) => <span>{label}</span>,
}));

describe('ConfigUserCellRenderer', () => {
    it('displays the user avatar label', () => {
        render(<ConfigUserCellRenderer value="john" backgroundColor="red" />);
        expect(screen.getByText('john')).toBeVisible();
    });
});

describe('ConfigModifyCellRenderer', () => {
    const renderRenderer = (props: Partial<ConfigModifyCellRendererParams>) =>
        render(
            <IntlProvider locale="en" messages={{ modify: 'Modify' }}>
                <ConfigModifyCellRenderer {...(props as ConfigModifyCellRendererParams)} />
            </IntlProvider>
        );

    it('calls onModify with the row data when clicked', async () => {
        const onModify = vi.fn();
        const data = { processConfigName: 'cfg' };
        renderRenderer({ data, onModify });
        await userEvent.click(screen.getByRole('button', { name: 'Modify' }));
        expect(onModify).toHaveBeenCalledWith(data);
    });
});

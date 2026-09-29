/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { screen, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import type { ProcessConfigFormValues } from '@gridsuite/commons-ui';
import { renderWithProviders } from 'test-utils/render-with-providers';
import { processConfigValues } from 'test-utils/fixtures';
import { server } from 'test-utils/msw/server';
import { useCreateProcessConfig } from '../use-create-process-config';
import { useCreateProcessConfigSubmit } from '../useCreateProcessConfigSubmit';

function SubmissionForm({ onClose }: { readonly onClose: () => void }) {
    const form = useForm<ProcessConfigFormValues>({ defaultValues: processConfigValues() });
    const { createProcessConfig } = useCreateProcessConfig();
    const { submit, isSubmitting } = useCreateProcessConfigSubmit({ form, createProcessConfig, onClose });
    return (
        <>
            <label htmlFor="config-name">
                Name
                <input id="config-name" {...form.register('name', { required: true })} />
            </label>
            {form.formState.errors.name && <p role="alert">Name is required</p>}
            <button type="button" onClick={submit} disabled={isSubmitting}>
                Create
            </button>
        </>
    );
}

describe('configuration submission', () => {
    it('blocks repeat submission while pending, then notifies and closes on success', async () => {
        const response = Promise.withResolvers<void>();
        const request = vi.fn(async () => {
            await response.promise;
            return HttpResponse.json('created-uuid');
        });
        server.use(http.post('*/v1/explore/process-configs', request));
        const onClose = vi.fn();
        const { user } = renderWithProviders(<SubmissionForm onClose={onClose} />);
        const button = screen.getByRole('button', { name: 'Create' });

        await user.click(button);
        await waitFor(() => expect(request).toHaveBeenCalledOnce());
        expect(button).toBeDisabled();
        await user.click(button);
        expect(request).toHaveBeenCalledOnce();
        expect(onClose).not.toHaveBeenCalled();
        response.resolve();

        expect(await screen.findByText('Process configuration created in "/Configurations".')).toBeVisible();
        expect(onClose).toHaveBeenCalledOnce();
        await waitFor(() => expect(button).toBeEnabled());
    });

    it('rejects invalid input without sending a request', async () => {
        const request = vi.fn(() => HttpResponse.json('created-uuid'));
        server.use(http.post('*/v1/explore/process-configs', request));
        const onClose = vi.fn();
        const { user } = renderWithProviders(<SubmissionForm onClose={onClose} />);
        await user.clear(screen.getByRole('textbox', { name: 'Name' }));
        await user.click(screen.getByRole('button', { name: 'Create' }));
        expect(await screen.findByRole('alert')).toHaveTextContent('Name is required');
        expect(request).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
        expect(screen.getByRole('button', { name: 'Create' })).toBeEnabled();
    });

    it('keeps the form recoverable after failure and allows retry', async () => {
        server.use(http.post('*/v1/explore/process-configs', () => HttpResponse.json({}, { status: 500 })));
        const onClose = vi.fn();
        const { user } = renderWithProviders(<SubmissionForm onClose={onClose} />);
        await user.click(screen.getByRole('button', { name: 'Create' }));
        expect(await screen.findByText('Configuration save failed.')).toBeVisible();
        expect(onClose).not.toHaveBeenCalled();
        expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Loadflow');
        expect(screen.getByRole('button', { name: 'Create' })).toBeEnabled();

        server.use(http.post('*/v1/explore/process-configs', () => HttpResponse.json('created-uuid')));
        await user.click(screen.getByRole('button', { name: 'Create' }));
        await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
    });
});

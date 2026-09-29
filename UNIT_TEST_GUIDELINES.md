# Unit Test Guidelines

## Scope and scenarios

- Test application behavior, not React, MUI, or RTK Query internals. Choose the smallest boundary that proves the behavior. Do not duplicate the same scenario at every layer.
- Test pure mappings, filters, and validation directly. Test hooks independently when they have their own contract. Otherwise, cover them through the component or workflow that uses them.
- Put tests in the relevant `__tests__` directory. Name each case for its condition and expected outcome, such as `rolls back the update when the request fails`.
- Cover relevant boundaries and failures, not just successful rendering. 

| Behavior          | What to prove                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------------- |
| Data fetching     | Loaded content, pending state, empty response, handled error                                  |
| Form submission   | Correct request, invalid input blocks submission, pending state prevents duplicate submission |
| Optimistic update | Immediate change, persistence on success, rollback on failure                                 |
| Navigation        | User action displays the expected destination content                                         |

## Shared helpers

- Use `renderWithProviders` from `test-utils/render-with-providers` for app UI, and `createTestProviders` for hooks needing the full provider tree. Use `createTestContext` from `test-utils/create-test-context` for Redux-only hooks.
- Reuse these helpers instead of duplicating provider trees. They create a fresh store and default to an authenticated user. The full provider tree includes routing, the app theme, English messages, and snackbars.
- Set `initialEntries` for routes and `state` for Redux overrides. 
- Use fixtures from `test-utils/fixtures.ts` and override only fields relevant to the scenario.

## Mocking boundaries

- Keep application components, forms, Redux, and RTK Query real in feature tests. Mock HTTP with the shared MSW `server`.
- Use realistic payloads and assert important request parameters/body as well as the resulting UI or hook state.
- Mock public callbacks or external widgets only when needed for the test's scope.

## Interactions and assertions

- Prefer accessible roles and names for controls: `findByRole('link', { name: 'Failed' })`. Use text queries for plain content: `findByText('No process executions found.')`.
- Use the `user` returned by `renderWithProviders` and await interactions.
- Control pending responses with deferred promises instead of sleeps. Prove the pending state before releasing the response, then await completion.

## Examples

### Pure mapping: assert the output contract

```ts
it('maps a typed form to metadata and the serialized backend configuration', () => {
    expect(toCreateProcessConfigApiArg(processConfigValues())).toEqual({
        name: 'Load flow',
        description: 'A configuration for testing',
        parentDirectoryUuid: 'directory-1',
        body: JSON.stringify({
            processType: 'LOADFLOW',
            modifications: [],
            loadflowParametersUuid: 'parameters-1',
        }),
    });
});
```

### React events: interact with the component, not its handler

Use of the shared render helper and user interactions.

```tsx
it('calls the confirmation callback when the user confirms', async () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    const { user } = renderWithProviders(
        <AppDialog open title="Confirm execution" onClose={onClose} onConfirm={onConfirm} confirmLabel="Launch">
            Ready to launch this execution?
        </AppDialog>
    );

    await user.click(screen.getByRole('button', { name: 'Launch' }));

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onClose).not.toHaveBeenCalled();
});
```

Keep the real component and mock only its public callbacks. Calling `onConfirm()` directly would test the mock, not the button wiring. 

### Feature: keep fetching and rendering real

```tsx
it('refreshes the execution status', async () => {
    server.use(http.get('*/v1/executions', () => HttpResponse.json([execution])));
    const { user } = renderWithProviders(<ProcessResultsPage />);
    expect(await screen.findByRole('link', { name: 'Failed' })).toBeVisible();

    server.use(http.get('*/v1/executions', () => HttpResponse.json([{ ...execution, status: 'COMPLETED' }])));
    await user.click(screen.getByRole('button', { name: 'Refresh' }));

    expect(await screen.findByRole('link', { name: 'Finished' })).toBeVisible();
    await waitFor(() => expect(screen.queryByRole('link', { name: 'Failed' })).not.toBeInTheDocument());
});
```
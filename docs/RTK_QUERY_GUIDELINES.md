# RTK Query — Guidelines

**RTK Query should be used by default for all API requests**, except in the specific cases described below.

## Usage

| Hook | When to use                                                                                                                                                         |
|---|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `useQuery` | Data that the UI needs to display and keep synchronized with the server (lists, details, search results).                                                           |
| `useLazyQuery` | Data fetched on demand, typically consumed for a one-time operation (e.g. form prefill), or when a component from an external lib expects a Promise-based callback. |
| `useMutation` | Write operations and business actions. A POST used only to retrieve data should generally be a query (see technical notes).                                         |

**Caching:** Keep RTK Query's default behavior. Define invalidation rules when data consistency requires them, and optimize only when necessary.

## Exceptions

- **File downloads** (Blob, CSV, ZIP), application bootstrap, and specific technical operations may use dedicated fetch adapters when RTK Query adds unnecessary complexity.
- **`commons-ui`**: existing self-contained components can keep their internal fetches. When a component expects a Promise-based callback from the application, prefer `useLazyQuery` with `.unwrap()` for read operations. See technical notes for [when to migrate commons ui components](#when-to-migrate-commons-ui-components).

## Technical notes

### POST endpoints used as queries

The OpenAPI code generator may classify read-only POST endpoints as mutations. Override their type in the `@rtk-query/codegen-openapi` configuration when queries are more appropriate:

```ts
endpointOverrides: [
    {
        pattern: 'getResults',
        type: 'query',
    },
],
```

This preserves the HTTP method and request body while generating a query.

### Lazy query invalidation

Lazy queries remain subscribed after their initial trigger. Cache invalidation can therefore cause an automatic refetch, even when the response was only needed for a one-time operation.

**Accept this behavior by default** to keep implementations simple. If unnecessary refetches become problematic, consider a one-time request without an active subscription:

```ts
dispatch(
    api.endpoints.getConfig.initiate(id, {
        subscribe: false,
    })
).unwrap();
```

Alternatively, you can explicitly unsubscribe after completing the lazy query.

### When to migrate commons-ui components

Components that encapsulate their own data fetching should not be migrated solely to enforce RTK Query usage.

Consider migration when:
- Data sharing: the same server data is frequently accessed across multiple components, making a shared cache beneficial.
- Performance: repeated or expensive requests could be avoided through caching.

For example, a directory selector used briefly in a dialog can keep its internal fetches. However, multiple file explorers displaying overlapping directories and requiring synchronized updates may benefit from RTK Query.

Migration should be evaluated, case by case, based on actual needs, considering the complexity of adapting the component's internal state to a shared cache.

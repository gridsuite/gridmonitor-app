# GridMonitor

## Description

Frontend application developed with React.

This app uses the `@gridsuite/commons-ui` library released in npm packages.

User interface used to:

- configure calculation processes;
- compare calculation process configurations;
- define configurations for automatic processes;
- view configurations used by automatic processes;
- launch executions;
- monitor processing status in real time;
- view results and logs;
- get an aggregated view of analysis results.

`gridmonitor-app` consumes the REST API exposed by `monitor-server`, manages UI state, handles navigation, and provides user interactions.

To launch the app, run:

```sh
npm install
npm start
```

If you are a developer and you want to update or enhance components used from the GridSuite `commons-ui` library, click [here](https://github.com/gridsuite/commons-ui) and follow the instructions.

See the [UI styling guidelines](STYLE_GUIDELINES.md) for this application's theme, colors, spacing, and responsive layout conventions.

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Technical Stack

- React
- React Compiler
- TypeScript
- Vite
- React Router
- Redux Toolkit
- RTK Query
- React Hook Form
- Zod

## Source Organization

The application uses a lightweight feature-oriented structure:

```text
src/
  app/                         Application composition and runtime wiring
    config/                    Theme and translation assembly
    layout/                    Shell, top bar, side bar, and navigation
    notifications/             Notification URLs, WebSocket wiring, invalidation
    providers/                 Global React providers
    router/                    Root routing
    store/                     Redux store assembly and middleware
  features/
    app-parameters/             Parameter interaction hooks
    authentication/             Authentication state and hooks
    process/
      execute/                 Execution workflow
      results/                 Results pages, table, and state
      router/                  Process route definitions
    process-config/            Configuration workflow and routes
  shared/
    api/                       Service clients and API infrastructure
    config/                    Shared configuration and parameter persistence
    lib/                       Cross-feature utilities
    translations/              Translation resources
    ui/                        Reusable, domain-independent UI
  plugins/                     Application extension points and translations
  test-utils/                  Shared test context and MSW setup
  assets/                      Bundled static assets
  types/                       Ambient declarations and library augmentations
```

### Ownership and dependency rules

- `app` composes features and shared infrastructure. Shell navigation belongs here,
  not in a business feature. Application-specific WebSocket clients that access
  the Redux singleton also belong here.
- `features` owns business workflows. Keep their pages, components, hooks, models,
  routes, and state together; add subfolders only when needed. Keep the existing
  `process/execute` and `process/results` split rather than introducing another
  global `components` or `hooks` folder.
- `shared` contains code used across features or infrastructure. It must not
  import features, plugins, or app runtime code. Shared parameter types, defaults,
  and local-storage helpers live in `shared/config/app-parameters`, since both
  feature hooks and the config API use them.
- **Pragmatic Redux exception:** features may import `app/store` for typed hooks
  and state integration; shared API modules may use explicit `import type` for
  store types. Type-only imports do not create runtime dependencies. Other
  feature-to-app imports and shared-to-app runtime imports are rejected by ESLint.
  Test files are exempt so they can exercise application integration.
- Use source-root imports (`features/...`, `shared/...`, `app/...`) across
  module boundaries and relative imports within a module. Prefer the service
  entry points (`shared/api/monitor-api`, etc.) over generated API imports:
  enhancements must be applied. Keep generation inputs in `codegen/` and do not
  move or edit generated clients manually.
- Colocate new tests in `__tests__` next to their owning module. Use PascalCase
  for React components and kebab-case for hooks and non-component modules.
  Existing naming and test-layout differences can be migrated when those
  modules are changed, rather than through a repository-wide rename.

### Architectural assessment and next steps

Feature colocation, centralized app composition, and separate generated/enhanced
API clients already follow common React/Redux organization practices. The layout
and notification ownership rules above address the main layering problems without
adding a full multi-layer architecture or changing application behavior.

As the app grows, introduce small explicit feature entry points where multiple
consumers need a stable interface; avoid blanket barrel exports of all internals.
Keep process-specific grid helpers inside the process feature, and promote them
to `shared` only when another feature actually needs them. Consider extracting
typed Redux hooks from store initialization if singleton coupling becomes a
testing or reuse obstacle. These are incremental options, not prerequisites for
the current application size.

## Development Scripts

- **`npm run start`** - Starts the Vite development server.
- **`npm run start:checks`** - Starts the Vite development server with checker support enabled.
- **`npm run type-check`** - Runs TypeScript type checking without emitting files. This ensures all developers use the project's local TypeScript version from `node_modules` rather than a potentially different globally-installed version. Run this to verify your code has no type errors before committing.
- **`npm run lint`** - Runs ESLint and fails on warnings.
- **`npm run lint:format`** - Checks formatting with Prettier.
- **`npm run build`** - Builds the application. This automatically runs `npm run prebuild` first.
- **`npm run prebuild`** - Runs linting and type checking before the build. This script is executed automatically by npm before `npm run build` and ensures that the build is not executed if linting or type checking fails. You do not need to call this manually unless you want to verify code quality without building.
- **`npm run test`** - Runs tests with Vitest.

## OpenAPI Code Generation

The interface with `monitor-server` is generated using OpenAPI code generation.
This includes hooks and types from the backend.

To do so, extract openapi.yaml from monitor-server and run:

```sh
npm run generate:api
```

Do not manually modify generated files, as they are automatically generated and will be overwritten.

## TypeScript Config

The `tsconfig.json` file defines the application TypeScript configuration used by Vite, Vitest, ESLint, and Prettier.
Some property values have been changed to meet the project needs, such as `target`, `baseUrl`, and module resolution.

## License Headers and Dependencies Checking

To check dependencies license compatibility with this project locally, run:

```sh
npm run licenses-check
```

Notes:

- Check [license-checker-config.json](license-checker-config.json) for the license allow list and package exclusions.
  If you need to update this list, please inform the organization's owners.
- Some packages are excluded because their licenses are not correctly described in their package metadata:
    - `esprima@1.2.2`
    - `jackspeak@2.3.6`
    - `path-scurry@1.10.2`

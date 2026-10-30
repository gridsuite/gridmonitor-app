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

See the [UI styling guidelines](docs/STYLE_GUIDELINES.md) for this application's theme, colors, spacing, and responsive layout conventions.

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
- Yup

## Development Scripts

- **`npm run start`** - Starts the Vite development server.
- **`npm run start:checks`** - Starts the Vite development server with checker support enabled.
- **`npm run type-check`** - Runs TypeScript type checking without emitting files. This ensures all developers use the project's local TypeScript version from `node_modules` rather than a potentially different globally-installed version. Run this to verify your code has no type errors before committing.
- **`npm run lint`** - Runs ESLint and fails on warnings.
- **`npm run lint:format`** - Checks formatting with Prettier.
- **`npm run build`** - Builds the application. This automatically runs `npm run prebuild` first.
- **`npm run prebuild`** - Runs linting and type checking before the build. This script is executed automatically by npm before `npm run build` and ensures that the build is not executed if linting or type checking fails. You do not need to call this manually unless you want to verify code quality without building.

## Architecture

The application follows a feature-based architecture, separating application setup, business features, and reusable code.

### Directory structure

```text
src/
├── app/          # Application setup, routing, pages, layout, providers and Redux store
├── features/     # Business features and their components, hooks and logic
├── shared/       # Reusable components, utilities, API clients and configuration
├── plugins/      # Plugin registration and translations
├── assets/       # Static assets
├── types/        # Global TypeScript declarations
└── test-utils/   # Shared testing utilities, fixtures and MSW setup
```

### Architecture rules

- Features and shared modules must not depend on application wiring (routing configuration, providers, store initialization, etc.).
- From `shared` and `features` directories, a limited set of imports from `app/` is allowed, including route paths, typed Redux hooks and store types. See `eslint.config.js` for the enforced boundaries.
- Import store types using `import type`. Do not import the runtime store from features or shared modules.
- Do not import generated RTK Query APIs directly. Use the enhanced API entry points instead.
- Keep unit tests close to the code they test, using `*.test.ts` or `*.test.tsx`. See [unit test guidelines](docs/UNIT_TEST_GUIDELINES.md).

## Testing

- **`npm run test`** - Runs Vitest in watch mode.
- **`npm run test:run`** - Runs the complete test suite once.
- **`npm run test:coverage`** - Runs the test suite and generates text and LCOV coverage reports.

See the [unit test guidelines](docs/UNIT_TEST_GUIDELINES.md) for test scope, shared helpers, mocking boundaries, and examples.

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

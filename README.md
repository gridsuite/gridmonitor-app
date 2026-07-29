# Gridmonitor-App

## Presentation

Frontend application developed with React.

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

## Technologies

- React
- React Compiler
- TypeScript
- Vite
- React Router
- Redux Toolkit
- RTK Query
- React Hook Form
- Zod

## OpenAPI Code Generation

The interface with `monitor-server` is generated using OpenAPI code generation.
This includes hooks and types from the backend.

To do so, extract openapi.yaml from monitor-server and run:

```sh
npm run generate:api
```

Do not manually modify generated files, as they are automatically generated and will be overwritten.

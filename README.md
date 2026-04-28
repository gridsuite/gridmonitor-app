# Gridmonitor-App

## Open API Code generation
Interface with monitor-server is generated using openapi-generator.
This includes hooks and types from backend

To do so, extract openapi.yaml from monitor-server and run:
`npm run generate:api`

Do not manually modify generated files, as they are automatically generated and will be overwritten.

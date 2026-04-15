import type { ConfigFile } from '@rtk-query/codegen-openapi';

const config: ConfigFile = {
    schemaFile: 'codegen/monitor-api/api-docs.json',
    apiFile: 'shared/api/rtk-query/base-api.ts',
    apiImport: 'baseApi',
    outputFile: 'src/shared/api/monitor-api/monitor.generated.ts',
    exportName: 'monitorApi',
    hooks: true,
};

export default config;

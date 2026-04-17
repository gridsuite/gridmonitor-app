import type { ConfigFile } from '@rtk-query/codegen-openapi';

const config: ConfigFile = {
    schemaFile: 'codegen/monitor-api/api-docs-new.json',
    apiFile: 'shared/api/monitor-api/monitor-base-api.ts',
    apiImport: 'monitorBaseApi',
    outputFile: 'src/shared/api/monitor-api/monitor.generated-new.ts',
    exportName: 'monitorGeneratedApi',
    hooks: true,
    useEnumType: true,
};

export default config;

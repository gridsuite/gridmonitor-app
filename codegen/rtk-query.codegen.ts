import { generateEndpoints } from '@rtk-query/codegen-openapi';
import monitorConfig from './monitor-api/monitor.codegen';

async function run() {
    await generateEndpoints(monitorConfig);
}

run();

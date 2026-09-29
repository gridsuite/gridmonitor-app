/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// @vitest-environment node

import { ESLint } from 'eslint';
import tseslint from 'typescript-eslint';
import { describe, expect, it } from 'vitest';

const eslint = new ESLint({ overrideConfig: [tseslint.configs.disableTypeChecked] });

async function getRuleIds(code: string, filePath: string) {
    const results = await eslint.lintText(code, { filePath });
    return results.flatMap((result) => result.messages.map((message) => message.ruleId));
}

describe('architecture boundaries', () => {
    it.each([
        'app/store/store',
        '../../app/store/store',
        '@/app/store/store',
        'features/authentication/store/authentication.selectors',
        '../../features/authentication/store/authentication.selectors',
        'plugins',
    ])('rejects shared runtime imports from %s', async (source) => {
        const rules = await getRuleIds(`import { value } from '${source}';`, 'src/shared/ui/Loader.tsx');

        expect(rules).toContain('@typescript-eslint/no-restricted-imports');
    });

    it('allows shared API type-only store imports', async () => {
        const rules = await getRuleIds(
            "import type { RootState } from 'app/store/store';",
            'src/shared/api/rtk-query/base-api.ts'
        );

        expect(rules).not.toContain('@typescript-eslint/no-restricted-imports');
    });

    it.each(['app/layout/AppLayout', '../../../app/layout/AppLayout'])(
        'rejects feature imports from app composition via %s',
        async (source) => {
            const rules = await getRuleIds(
                `import { AppLayout } from '${source}';`,
                'src/features/process-config/pages/ProcessConfigPage.tsx'
            );

            expect(rules).toContain('import-x/no-restricted-paths');
        }
    );

    it('allows feature Redux integration', async () => {
        const rules = await getRuleIds(
            "import { useAppSelector } from 'app/store/store';",
            'src/features/process-config/pages/ProcessConfigPage.tsx'
        );

        expect(rules).not.toContain('import-x/no-restricted-paths');
    });

    it('preserves the generated API import restriction', async () => {
        const rules = await getRuleIds(
            "import { monitorGeneratedApi } from 'shared/api/monitor-api/monitor.generated';",
            'src/features/process-config/pages/ProcessConfigPage.tsx'
        );

        expect(rules).toContain('no-restricted-imports');
    });
});

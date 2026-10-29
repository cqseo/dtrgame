import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { originalAccountTemplates } from '../src/generated/original-account-templates';
import type { TemplateContext } from '../src/original-template-runtime';
const fixture = JSON.parse(fs.readFileSync(new URL('./fixtures/original-account-templates-php.json', import.meta.url), 'utf8')) as {
  cases: { name: keyof typeof originalAccountTemplates; context: TemplateContext; html: string }[];
};
describe('Unmodified source PHP account template render parity', () => {
  for (const [i, sample] of fixture.cases.entries()) {
    it(`matches all HTML bytes for source fixture ${i} (${sample.name})`, () => {
      const result = originalAccountTemplates[sample.name]({ ...sample.context }, { IN_GAME: true, CURSCRIPT: 'login' }, () => { throw new Error('Unexpected asset read'); });
      expect(result).toBe(sample.html);
    });
  }
});

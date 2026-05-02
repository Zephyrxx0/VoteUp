import { test } from 'node:test';
import assert from 'node:assert';
import { AICustomizer } from '../src/services/checklist/ai-customizer.ts';
import { TemplateProvider } from '../src/services/checklist/template-provider.ts';

test('AICustomizer returns validated customized template when Gemini output is valid', async () => {
  const provider = new TemplateProvider();
  const baseTemplate = provider.getTemplate(1);

  const customized = {
    ...baseTemplate,
    items: baseTemplate.items.map((item, index) => ({
      ...item,
      title: `${item.title} (${index + 1})`,
      description: `${item.description} Deadline by 20 May at ERO Office, Chennai South.`,
    })),
  };

  const customizer = new AICustomizer({
    async generateContent() {
      return {
        response: {
          text: () => JSON.stringify(customized),
        },
      };
    },
  });

  const result = await customizer.customize(baseTemplate, 'Chennai South', 1);
  assert.strictEqual(result.stage, 1);
  assert.strictEqual(result.items.length, baseTemplate.items.length);
  assert.match(result.items[0].description, /Deadline by 20 May/);
});

test('AICustomizer falls back to static template when Gemini returns invalid payload', async () => {
  const provider = new TemplateProvider();
  const baseTemplate = provider.getTemplate(2);

  const customizer = new AICustomizer({
    async generateContent() {
      return {
        response: {
          text: () => JSON.stringify({ foo: 'bar' }),
        },
      };
    },
  });

  const result = await customizer.customize(baseTemplate, 'Chennai South', 2);
  assert.deepStrictEqual(result, baseTemplate);
});

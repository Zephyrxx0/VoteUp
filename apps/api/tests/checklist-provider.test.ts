import { test } from 'node:test';
import assert from 'node:assert';
import { TemplateProvider } from '../src/services/checklist/template-provider.ts';

test('TemplateProvider returns templates for all 8 stages', () => {
  const provider = new TemplateProvider();

  for (let stage = 1; stage <= 8; stage += 1) {
    const template = provider.getTemplate(stage);
    assert.strictEqual(template.stage, stage);
    assert.ok(template.stageName.length > 0);
    assert.ok(template.items.length >= 3);
    assert.ok(template.items.length <= 5);
    template.items.forEach((item) => {
      assert.strictEqual(item.stage, stage);
      assert.ok(item.id.length > 0);
      assert.ok(item.title.length > 0);
      assert.ok(item.description.length > 0);
    });
  }
});

test('TemplateProvider throws for invalid stage', () => {
  const provider = new TemplateProvider();
  assert.throws(() => provider.getTemplate(0), /Invalid stage/);
  assert.throws(() => provider.getTemplate(9), /Invalid stage/);
});

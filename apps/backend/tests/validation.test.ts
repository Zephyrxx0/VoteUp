import { test } from 'node:test';
import assert from 'node:assert';
import { validateEPIC } from '../src/lib/validation.ts';

test('VAL-01: validateEPIC - modern (valid format + valid Luhn)', () => {
  // XYZ1234566 passes Luhn checksum on '1234566'
  const result = validateEPIC('XYZ1234566');
  assert.strictEqual(result.valid, true);
  assert.strictEqual(result.type, 'modern');
  assert.strictEqual(result.confidence, 0.95);
});

test('VAL-01: validateEPIC - legacy (valid format + invalid Luhn)', () => {
  // XYZ1234567 fails Luhn checksum on '1234567' (sum 31)
  const result = validateEPIC('XYZ1234567');
  assert.strictEqual(result.valid, true);
  assert.strictEqual(result.type, 'legacy');
  assert.strictEqual(result.confidence, 0.6);
});

test('VAL-01: validateEPIC - invalid format', () => {
  const result = validateEPIC('AB1234567'); // Too short
  assert.strictEqual(result.valid, false);
  assert.ok(result.errors?.includes('EPIC must be 3 letters followed by 7 digits'));
});

test('VAL-01: validateEPIC - normalization', () => {
  const result = validateEPIC('  xyz1234566  ');
  assert.strictEqual(result.valid, true);
  assert.strictEqual(result.type, 'modern');
});

test('VAL-01: validateEPIC - edge cases', () => {
  // @ts-ignore
  assert.strictEqual(validateEPIC(null).valid, false);
  assert.strictEqual(validateEPIC('').valid, false);
});

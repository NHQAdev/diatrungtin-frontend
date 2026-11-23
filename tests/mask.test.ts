import assert from 'node:assert/strict';
import { test } from 'node:test';
import { initials, maskEmail } from '../src/features/auth/mask.ts';

test('maskEmail keeps the first two letters and the domain', () => {
  assert.equal(maskEmail('minhanh@example.com'), 'mi••••@example.com');
  assert.equal(maskEmail('ab@x.vn'), 'a••••@x.vn');
  assert.equal(maskEmail('not-an-email'), 'not-an-email');
});

test('initials uses the last two words of a Vietnamese name', () => {
  assert.equal(initials('Nguyễn Minh Anh'), 'MA');
  assert.equal(initials('  an  '), 'A');
  assert.equal(initials('Trần Thị Bích Ngọc'), 'BN');
});

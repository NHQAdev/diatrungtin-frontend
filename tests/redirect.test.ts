import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loginUrl, safeNextPath } from '../src/features/auth/redirect.ts';

test('safeNextPath keeps same-site paths', () => {
  assert.equal(safeNextPath('/gio-hang'), '/gio-hang');
  assert.equal(safeNextPath('/san-pham/vong-tay?x=1'), '/san-pham/vong-tay?x=1');
});

test('safeNextPath rejects other sites and loops', () => {
  for (const bad of [null, '', 'https://evil.com', '//evil.com', '/\\evil.com', 'javascript:alert(1)', '/dang-nhap', '/dang-ky?next=/']) {
    assert.equal(safeNextPath(bad), '/');
  }
});

test('loginUrl adds next only when useful', () => {
  assert.equal(loginUrl('/'), '/dang-nhap');
  assert.equal(loginUrl('/dang-nhap?next=/x'), '/dang-nhap');
  assert.equal(loginUrl('/gio-hang'), '/dang-nhap?next=%2Fgio-hang');
});

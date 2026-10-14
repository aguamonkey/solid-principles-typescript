import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { inspectDocument } from '../../scripts/check-docs.mjs';
function fixture(body, extra, callback) {
  const root = mkdtempSync(join(tmpdir(), 'solid-docs-'));
  try {
    writeFileSync(join(root, 'README.md'), body);
    for (const [name, content] of Object.entries(extra)) writeFileSync(join(root, name), content);
    callback(inspectDocument(join(root, 'README.md'), root));
  } finally { rmSync(root, { recursive: true, force: true }); }
}
test('missing links and HTML images fail', () => fixture('[Missing](missing.md)\n<img src="missing.png">', {}, errors => assert.equal(errors.length, 2)));
test('encoded paths and valid fragments pass', () => fixture('[Guide](guide%20one.md#read-this)', { 'guide one.md': '# Read this\n' }, errors => assert.deepEqual(errors, [])));
test('fenced examples and external links are ignored', () => fixture('```md\n[Example](missing.md)\n```\n[Docs](https://example.com)', {}, errors => assert.deepEqual(errors, [])));
test('out-of-repository links and missing headings fail', () => fixture('[Outside](../other.md)\n[Wrong](guide.md#unknown)', { 'guide.md': '# Known\n' }, errors => assert.equal(errors.length, 2)));

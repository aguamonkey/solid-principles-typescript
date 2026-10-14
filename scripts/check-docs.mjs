import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname, relative, extname } from 'node:path';
import { pathToFileURL } from 'node:url';

const stripFences = text => text.replace(/^(```|~~~)[\s\S]*?^\1.*$/gm, '');
const slug = text => text.toLowerCase().replace(/[`*_]/g, '').replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-');
function anchors(text) {
  const counts = new Map(); const result = new Set();
  for (const match of stripFences(text).matchAll(/^#{1,6}\s+(.+)$/gm)) {
    const base = slug(match[1]); const count = counts.get(base) ?? 0;
    counts.set(base, count + 1); result.add(count ? `${base}-${count}` : base);
  }
  return result;
}
export function inspectDocument(file, root) {
  const text = stripFences(readFileSync(file, 'utf8')); const errors = [];
  const links = [...text.matchAll(/!?\[[^\]]*\]\((?:<([^>]+)>|([^\s)]+)(?:\s+"[^"]*")?)\)/g)].map(m => m[1] ?? m[2]);
  links.push(...[...text.matchAll(/<(?:img|a)\b[^>]*\b(?:src|href)="([^"]+)"/g)].map(m => m[1]));
  for (const link of links) {
    if (/^[a-z][a-z\d+.-]*:/i.test(link)) continue;
    const [path, fragment] = link.split('#');
    const target = path ? resolve(dirname(file), decodeURIComponent(path)) : file;
    const location = relative(root, file);
    if (relative(root, target).startsWith('..')) { errors.push(`${location}: link leaves repository: ${link}`); continue; }
    if (!existsSync(target)) { errors.push(`${location}: missing target: ${link}`); continue; }
    if (fragment && extname(target) === '.md' && statSync(target).isFile() && !anchors(readFileSync(target, 'utf8')).has(decodeURIComponent(fragment))) {
      errors.push(`${location}: missing heading: ${link}`);
    }
  }
  return errors;
}
function markdownFiles(root) {
  const ignored = new Set(['.git', 'node_modules', 'dist', 'coverage', 'test-results', 'playwright-report']);
  return readdirSync(root, { withFileTypes: true }).flatMap(item => {
    if (ignored.has(item.name) || item.isSymbolicLink()) return [];
    const path = resolve(root, item.name);
    return item.isDirectory() ? markdownFiles(path) : item.name.endsWith('.md') ? [path] : [];
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const root = resolve(process.cwd()); const files = markdownFiles(root);
  const errors = files.flatMap(file => inspectDocument(file, root));
  if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
  else console.log(`Documentation links and images passed (${files.length} Markdown files).`);
}

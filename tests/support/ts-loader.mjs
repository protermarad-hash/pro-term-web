// Minimal Node ESM loader for the test suite: transpiles .ts/.tsx with the
// project's own TypeScript (no extra dependencies), resolves the "@/" alias,
// extension-less relative imports and CommonJS packages without "exports"
// (e.g. next/link). Used by `npm test` through tests/support/register.mjs.
import { readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const root = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
const srcDir = path.join(root, 'src');
const requireFromRoot = createRequire(path.join(root, 'package.json'));

// Next.js guards server modules with "server-only"; outside a bundler it is a no-op.
const STUBS = { 'server-only': 'data:text/javascript,export{}' };

function probe(base) {
  if (existsSync(base) && statSync(base).isFile()) return base;
  for (const ext of ['.ts', '.tsx', '.js', '.mjs']) {
    if (existsSync(base + ext)) return base + ext;
  }
  for (const ext of ['.ts', '.tsx', '.js']) {
    const index = path.join(base, `index${ext}`);
    if (existsSync(index)) return index;
  }
  return null;
}

function isProjectFile(file) {
  return file.startsWith(root) && !file.includes(`${path.sep}node_modules${path.sep}`);
}

export async function resolve(specifier, context, nextResolve) {
  if (Object.prototype.hasOwnProperty.call(STUBS, specifier)) {
    return { url: STUBS[specifier], shortCircuit: true };
  }

  let base = null;
  if (specifier.startsWith('@/')) {
    base = path.join(srcDir, specifier.slice(2));
  } else if ((specifier.startsWith('./') || specifier.startsWith('../')) && context.parentURL?.startsWith('file:')) {
    const parent = fileURLToPath(context.parentURL);
    if (isProjectFile(parent)) base = path.resolve(path.dirname(parent), specifier);
  }
  if (base) {
    const file = probe(base);
    if (file) return { url: pathToFileURL(file).href, shortCircuit: true };
  }

  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    // Packages without an "exports" map (next/link, next/image): CJS resolution.
    const requireFromParent = context.parentURL?.startsWith('file:')
      ? createRequire(fileURLToPath(context.parentURL))
      : requireFromRoot;
    try {
      return { url: pathToFileURL(requireFromParent.resolve(specifier)).href, shortCircuit: true };
    } catch {
      throw error;
    }
  }
}

// Bundlers unwrap `exports.default` of CommonJS modules compiled from ESM
// (`__esModule: true`, e.g. next/image); native Node does not. Apply the same
// interop to default imports from packages.
const DEFAULT_IMPORT_FROM_PACKAGE =
  /^import\s+([A-Za-z_$][\w$]*)\s*(,\s*\{[^}]*\})?\s+from\s+(['"])((?![./]|@\/)[^'"]+)\3;?$/gm;
const INTEROP_HELPER =
  'const __testInteropDefault = (m) => { const d = m.default; return d && typeof d === "object" && d.__esModule && "default" in d ? d.default : d; };\n';

function applyDefaultImportInterop(code) {
  let counter = 0;
  const rewritten = code.replace(DEFAULT_IMPORT_FROM_PACKAGE, (_match, local, named, quote, specifier) => {
    const ns = `__testNs${counter++}`;
    const namedImport = named ? `import ${named.replace(/^,\s*/, '')} from ${quote}${specifier}${quote};\n` : '';
    return `${namedImport}import * as ${ns} from ${quote}${specifier}${quote};\nconst ${local} = __testInteropDefault(${ns});`;
  });
  return counter > 0 ? INTEROP_HELPER + rewritten : rewritten;
}

export async function load(url, context, nextLoad) {
  if (url.startsWith('file:') && /\.tsx?$/.test(url)) {
    const file = fileURLToPath(url);
    if (isProjectFile(file)) {
      const source = await readFile(file, 'utf8');
      const { outputText } = ts.transpileModule(source, {
        fileName: file,
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
          jsx: ts.JsxEmit.ReactJSX,
          esModuleInterop: true,
          inlineSourceMap: true,
        },
      });
      return { format: 'module', source: applyDefaultImportInterop(outputText), shortCircuit: true };
    }
  }
  return nextLoad(url, context);
}

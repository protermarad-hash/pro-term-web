import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { buildGaranLabelSvg, GaranLabelTemplateError } from '@/lib/garan-label-svg';

const publicDir = path.join(process.cwd(), 'public');

// SHA-256 of the files published by the European Commission
// (commission.europa.eu › "Practical guidelines and high resolution vector
// files of the EU notice and label on product guarantees"). Any edit to these
// files – which the Regulation forbids – fails this test.
const OFFICIAL_FILES: Record<string, string> = {
  '/legal/eu-notificare-garantie-legala-ro.svg': 'dc168eca5e0b78f3daf7a3cf2b111987c3121d19eec52322a6eeb789b0c45b2a',
  '/legal/eu-notificare-garantie-legala-ro.png': '51d641e25d29a9cd4d087a6540d474ade46fd52b2e38f1ac65befb1108caa032',
  '/legal/eu-eticheta-garan-color.svg': '3414c8366823db39702d2557e614f882b530487ce589e903afdc98b7225e1ab1',
  '/legal/eu-eticheta-garan-imbricata.svg': '1c1122b25f39333b329e4156b572b65f1f850592df0b061358b9404f43acb994',
  // ANPC "PICTOGRAMA SAL ONLINE", https://www.anpc.ro/download/sal/SAL-PICTOGRAMA.png
  // (Last-Modified 04.05.2026), Ordinul ANPC nr. 449/2022 as amended by nr. 270/2026.
  '/legal/anpc-sal-pictograma.png': '22c8a45600aecb9db935d536691766a99b71f4ceb5153ce34681d8788c15d5ed',
};

function read(publicPath: string): Buffer {
  return readFileSync(path.join(publicDir, publicPath));
}

describe('official EU files', () => {
  for (const [file, expected] of Object.entries(OFFICIAL_FILES)) {
    it(`${file} is byte-identical to the Commission file`, () => {
      assert.equal(createHash('sha256').update(read(file)).digest('hex'), expected);
    });
  }
});

describe('GARAN label: only the editable fields change', () => {
  const template = read('/legal/eu-eticheta-garan-color.svg').toString('utf8');
  const nestedTemplate = read('/legal/eu-eticheta-garan-imbricata.svg').toString('utf8');
  const data = { yearsLabel: '5', manufacturerName: 'Producător Test', modelIdentifier: 'MODEL-X1' };

  const strip = (svg: string) =>
    svg
      .replace(/<\?xml[^>]*\?>\s*/, '')
      .replace(/<!--[\s\S]*?-->\s*/g, '')
      .replace(/<text\b[\s\S]*?<\/text>/g, '<text/>')
      .replace(/garan-t-/g, '')
      .replace(/font-family:[^;]+;/g, 'font-family:X;')
      .replace(/<svg aria-hidden="true" focusable="false" class="block h-auto w-full"/, '<svg');

  it('fills duration, producer and model identifier', () => {
    const svg = buildGaranLabelSvg(template, 'full', data, 'garan-t');
    assert.match(svg, />5<\/tspan>/);
    assert.match(svg, />Producător Test<\/text>/);
    assert.match(svg, /text-anchor="end">MODEL-X1<\/text>/);
    assert.doesNotMatch(svg, /Brand\//);
    assert.doesNotMatch(svg, /Model identifier/);
    assert.doesNotMatch(svg, />XX</);
  });

  it('leaves every non-editable element (QR code, shield, calendar, translations, frames, colours) untouched', () => {
    const svg = buildGaranLabelSvg(template, 'full', data, 'garan-t');
    assert.equal(strip(svg), strip(template));
    // Official colours are kept exactly as provided.
    for (const colour of ['#034ea2', '#fff200', '#231f20']) assert.ok(svg.includes(colour), colour);
  });

  it('scopes ids and classes so several labels can share a page', () => {
    const svg = buildGaranLabelSvg(template, 'full', data, 'garan-t');
    assert.doesNotMatch(svg, /\bclass="cls-/);
    assert.doesNotMatch(svg, /url\(#clippath/);
    assert.match(svg, /url\(#garan-t-clippath-6\)/);
  });

  it('escapes producer data instead of injecting markup', () => {
    const svg = buildGaranLabelSvg(template, 'full', { ...data, manufacturerName: '<script>x</script>&' }, 'garan-t');
    assert.doesNotMatch(svg, /<script>/);
    assert.match(svg, /&lt;script&gt;x&lt;\/script&gt;&amp;/);
  });

  it('nested display edits only "XX"', () => {
    const svg = buildGaranLabelSvg(nestedTemplate, 'nested', { yearsLabel: '7' }, 'garan-t');
    assert.match(svg, />7<\/tspan>/);
    assert.equal(strip(svg), strip(nestedTemplate));
  });

  it('fails loudly if the official template no longer matches', () => {
    assert.throws(
      () => buildGaranLabelSvg(template.replace('Model identifier', 'Model'), 'full', data, 'garan-t'),
      GaranLabelTemplateError,
    );
    assert.throws(() => buildGaranLabelSvg(template, 'full', { yearsLabel: '5' }, 'garan-t'), GaranLabelTemplateError);
  });
});

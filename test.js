#!/usr/bin/env node
// ── Lorebook Builder — Automated Test Suite ────────────────────────────────
// Run: node test.js
// Tests all pure/storage functions. No browser required.

'use strict';

// ── Browser API stubs ───────────────────────────────────────────────────────

var _lsData = {};
global.localStorage = {
  getItem:  function(k)    { return Object.prototype.hasOwnProperty.call(_lsData,k) ? _lsData[k] : null; },
  setItem:  function(k,v)  { _lsData[k] = String(v); },
  removeItem:function(k)   { delete _lsData[k]; },
  clear:    function()     { _lsData = {}; },
};
global.TextEncoder = require('util').TextEncoder;
var _noop = function() {};
var _noopEl = { style: {}, textContent: '', classList: { add:_noop, remove:_noop, toggle:_noop }, innerHTML: '', addEventListener:_noop };
global.window = { innerWidth: 1200, _lb_expand_default: false };
try { Object.defineProperty(global, 'navigator', { value: { maxTouchPoints: 0 }, writable: true }); } catch(e) {}
global.document = {
  createElement: function() { return { href:'', download:'', click:_noop, style:{}, textContent:'', classList:{add:_noop,remove:_noop,toggle:_noop}, appendChild:_noop }; },
  getElementById: function() { return _noopEl; },
  head: { appendChild: _noop },
  body: { appendChild: _noop },
  addEventListener: _noop,
};
global.URL = { createObjectURL: function() { return 'blob:test'; } };
global.Blob = function(parts) { this._parts = parts; };

// ── Load shared.js (everything before mobile UI marker) ────────────────────

var fs = require('fs');
var vm = require('vm');
function run(code) { vm.runInThisContext(code); }

var sharedSrc = fs.readFileSync(__dirname + '/src/shared.js', 'utf8');
// Stop at the mobile UI section — only load shared utilities
var mobileMarker = sharedSrc.indexOf('// ── MOBILE UI');
var sharedOnly = mobileMarker > 0 ? sharedSrc.slice(0, mobileMarker) : sharedSrc;
run(sharedOnly);

// Load parseImportText and parseTXT from desktop-io (pure functions
// living inside the launchBuilder closure — extract them directly)
var deskIO = fs.readFileSync(__dirname + '/src/desktop-io.js', 'utf8');

var pIT = deskIO.match(/function parseImportText[\s\S]*?\n  \}/)[0];
run('var parseImportText = ' + pIT.replace(/^function parseImportText/, 'function'));

var pTXT = deskIO.match(/function parseTXT[\s\S]*?\n  \}/)[0];
run('var parseTXT = ' + pTXT.replace(/^function parseTXT/, 'function'));

// ── Test harness ────────────────────────────────────────────────────────────

var passed = 0, failed = 0, total = 0;
var currentSuite = '';

function suite(name) {
  currentSuite = name;
  console.log('\n  ' + name);
}

function test(desc, fn) {
  total++;
  try {
    fn();
    console.log('    \x1b[32m✓\x1b[0m ' + desc);
    passed++;
  } catch(e) {
    console.log('    \x1b[31m✗\x1b[0m ' + desc);
    console.log('      \x1b[31m' + e.message + '\x1b[0m');
    if (e.actual !== undefined) {
      console.log('      expected: ' + JSON.stringify(e.expected));
      console.log('      actual:   ' + JSON.stringify(e.actual));
    }
    failed++;
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'Assertion failed');
}

function assertEqual(actual, expected, msg) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    var e = new Error((msg || 'Not equal') + '\n      expected: ' + JSON.stringify(expected) + '\n      actual:   ' + JSON.stringify(actual));
    e.actual = actual; e.expected = expected;
    throw e;
  }
}

function assertContains(str, sub, msg) {
  if (typeof str !== 'string' || str.indexOf(sub) === -1)
    throw new Error((msg || 'String does not contain') + ': ' + JSON.stringify(sub) + ' in ' + JSON.stringify(str.slice(0,120)));
}

function assertNotContains(str, sub, msg) {
  if (typeof str === 'string' && str.indexOf(sub) !== -1)
    throw new Error((msg || 'String should not contain') + ': ' + JSON.stringify(sub));
}

// ── TESTS ────────────────────────────────────────────────────────────────────

console.log('\nLorebook Builder — Test Suite\n' + '═'.repeat(50));

// ────────────────────────────────────────────────
suite('escHtml');
// ────────────────────────────────────────────────

test('escapes ampersand', function() {
  assertEqual(escHtml('a & b'), 'a &amp; b');
});
test('escapes less-than', function() {
  assertEqual(escHtml('<tag>'), '&lt;tag&gt;');
});
test('escapes all three at once', function() {
  assertEqual(escHtml('<a & b>'), '&lt;a &amp; b&gt;');
});
test('handles empty string', function() {
  assertEqual(escHtml(''), '');
});
test('handles null/undefined gracefully', function() {
  assertEqual(escHtml(null), '');
  assertEqual(escHtml(undefined), '');
});
test('leaves safe text unchanged', function() {
  assertEqual(escHtml('Hello World'), 'Hello World');
});

// ────────────────────────────────────────────────
suite('regexEscape');
// ────────────────────────────────────────────────

test('escapes dot', function() {
  assert(new RegExp(regexEscape('3.14')).test('3.14'));
  assert(!new RegExp('^' + regexEscape('3.14') + '$').test('3X14'));
});
test('escapes brackets', function() {
  var re = new RegExp(regexEscape('[test]'));
  assert(re.test('[test]'));
});
test('escapes star and plus', function() {
  assertEqual(regexEscape('a*b+c'), 'a\\*b\\+c');
});
test('leaves alphanumerics unchanged', function() {
  assertEqual(regexEscape('hello123'), 'hello123');
});

// ────────────────────────────────────────────────
suite('lbBuildJSON');
// ────────────────────────────────────────────────

var baseState = {
  name: 'My Lorebook',
  entries: [
    { name: 'Aria', type: 'Character', triggers: ['aria', 'the ranger'], delim: ',', description: 'A skilled ranger.' },
    { name: 'Iron Keep', type: 'Location', triggers: ['iron keep', 'the keep'], delim: ',', description: 'A fortress.' },
  ]
};

test('produces valid JSON', function() {
  var result = JSON.parse(lbBuildJSON(baseState));
  assert(typeof result === 'object');
});
test('preserves lorebook name', function() {
  var result = JSON.parse(lbBuildJSON(baseState));
  assertEqual(result.name, 'My Lorebook');
});
test('entries are numbered from "1"', function() {
  var result = JSON.parse(lbBuildJSON(baseState));
  assert('1' in result.entries && '2' in result.entries);
  assert(!('0' in result.entries));
});
test('entry data is preserved', function() {
  var result = JSON.parse(lbBuildJSON(baseState));
  assertEqual(result.entries['1'].name, 'Aria');
  assertEqual(result.entries['2'].name, 'Iron Keep');
});
test('uses 4-space indentation', function() {
  var raw = lbBuildJSON(baseState);
  assert(raw.includes('    "name"'), 'should have 4-space indent');
});
test('handles empty entries array', function() {
  var result = JSON.parse(lbBuildJSON({ name: 'Empty', entries: [] }));
  assertEqual(result.entries, {});
});
test('falls back to Untitled Lorebook when name is blank', function() {
  var result = JSON.parse(lbBuildJSON({ name: '', entries: [] }));
  assertEqual(result.name, 'Untitled Lorebook');
});

// ────────────────────────────────────────────────
suite('lbBuildTXT');
// ────────────────────────────────────────────────

test('starts with LOREBOOK: header', function() {
  var txt = lbBuildTXT(baseState);
  assert(txt.startsWith('LOREBOOK: My Lorebook'), 'expected LOREBOOK header');
});
test('includes entry headers', function() {
  var txt = lbBuildTXT(baseState);
  assertContains(txt, '=== Aria ===');
  assertContains(txt, '=== Iron Keep ===');
});
test('includes type lines', function() {
  var txt = lbBuildTXT(baseState);
  assertContains(txt, 'Type: Character');
  assertContains(txt, 'Type: Location');
});
test('includes triggers with comma separator', function() {
  var txt = lbBuildTXT(baseState);
  assertContains(txt, 'Triggers: aria,the ranger');
});
test('uses semicolons when delim is ";"', function() {
  var state = { name: 'X', entries: [
    { name: 'A', type: 'Character', triggers: ['x', 'y'], delim: ';', description: '' }
  ]};
  assertContains(lbBuildTXT(state), 'Triggers: x; y');
});
test('includes description', function() {
  assertContains(lbBuildTXT(baseState), 'Description: A skilled ranger.');
});
test('omits Description line when empty', function() {
  var state = { name: 'X', entries: [
    { name: 'A', type: 'Character', triggers: [], delim: ',', description: '' }
  ]};
  assertNotContains(lbBuildTXT(state), 'Description:');
});
test('omits Triggers line when empty', function() {
  var state = { name: 'X', entries: [
    { name: 'A', type: 'Character', triggers: [], delim: ',', description: 'some text' }
  ]};
  assertNotContains(lbBuildTXT(state), 'Triggers:');
});

// ────────────────────────────────────────────────
suite('lbBuildDOCXParts');
// ────────────────────────────────────────────────

test('returns all required XML keys', function() {
  var parts = lbBuildDOCXParts(baseState);
  ['docXML','stylesXML','relsXML','docRelsXML','contentTypesXML'].forEach(function(k) {
    assert(typeof parts[k] === 'string' && parts[k].length > 0, 'missing: ' + k);
  });
});
test('docXML contains lorebook name as Heading1', function() {
  var parts = lbBuildDOCXParts(baseState);
  assertContains(parts.docXML, 'Heading1');
  assertContains(parts.docXML, 'My Lorebook');
});
test('docXML contains entry names as Heading2', function() {
  var parts = lbBuildDOCXParts(baseState);
  assertContains(parts.docXML, 'Heading2');
  assertContains(parts.docXML, 'Aria');
});
test('escapes HTML in entry content', function() {
  var state = { name: 'X', entries: [
    { name: 'A & B', type: 'Character', triggers: [], delim: ',', description: '<test>' }
  ]};
  var parts = lbBuildDOCXParts(state);
  assertContains(parts.docXML, 'A &amp; B');
  assertContains(parts.docXML, '&lt;test&gt;');
});
test('splits description on newlines into separate paragraphs', function() {
  var state = { name: 'X', entries: [
    { name: 'A', type: 'Character', triggers: [], delim: ',', description: 'Line one\nLine two' }
  ]};
  var parts = lbBuildDOCXParts(state);
  assertContains(parts.docXML, 'Line one');
  assertContains(parts.docXML, 'Line two');
});
test('stylesXML defines Heading1 and Heading2', function() {
  var parts = lbBuildDOCXParts(baseState);
  assertContains(parts.stylesXML, 'styleId="Heading1"');
  assertContains(parts.stylesXML, 'styleId="Heading2"');
});
test('contentTypesXML is well-formed XML', function() {
  var parts = lbBuildDOCXParts(baseState);
  assert(parts.contentTypesXML.startsWith('<?xml'), 'should start with XML declaration');
  assertContains(parts.contentTypesXML, 'document.xml');
});

// ────────────────────────────────────────────────
suite('ZIP builder (_lbU16, _lbU32, _lbCrc32, lbBuildZip)');
// ────────────────────────────────────────────────

test('_lbU16 little-endian encoding', function() {
  assertEqual(_lbU16(0x0102), [0x02, 0x01]);
  assertEqual(_lbU16(0), [0, 0]);
  assertEqual(_lbU16(255), [255, 0]);
});
test('_lbU32 little-endian encoding', function() {
  assertEqual(_lbU32(0x01020304), [0x04, 0x03, 0x02, 0x01]);
  assertEqual(_lbU32(0), [0, 0, 0, 0]);
});
test('_lbCrc32 of empty input', function() {
  assertEqual(_lbCrc32(new Uint8Array([])), 0x00000000);
});
test('_lbCrc32 known value for "123456789"', function() {
  var enc = new TextEncoder();
  assertEqual(_lbCrc32(enc.encode('123456789')), 0xCBF43926);
});
test('lbBuildZip produces valid ZIP magic bytes', function() {
  var enc = new TextEncoder();
  var zip = lbBuildZip([{ name: 'test.txt', data: enc.encode('hello') }]);
  assert(zip instanceof Uint8Array, 'should be Uint8Array');
  assertEqual(zip[0], 0x50); // P
  assertEqual(zip[1], 0x4B); // K
  assertEqual(zip[2], 0x03);
  assertEqual(zip[3], 0x04);
});
test('lbBuildZip EOCD signature present', function() {
  var enc = new TextEncoder();
  var zip = lbBuildZip([{ name: 'a.txt', data: enc.encode('x') }]);
  // End of central directory record starts with PK\x05\x06
  var found = false;
  for (var i = 0; i < zip.length - 3; i++) {
    if (zip[i]===0x50 && zip[i+1]===0x4B && zip[i+2]===0x05 && zip[i+3]===0x06) { found=true; break; }
  }
  assert(found, 'EOCD signature PK\\x05\\x06 not found');
});
test('lbBuildZip file data is present in output', function() {
  var enc = new TextEncoder();
  var content = 'Hello ZIP world';
  var zip = lbBuildZip([{ name: 'msg.txt', data: enc.encode(content) }]);
  // Convert to string to search for content
  var str = Array.from(zip).map(function(b){ return String.fromCharCode(b); }).join('');
  assertContains(str, content);
});

// ────────────────────────────────────────────────
suite('localStorage layer (lbSaveState / lbLoadState)');
// ────────────────────────────────────────────────

test('lbSaveState writes to localStorage', function() {
  localStorage.clear();
  var state = { name: 'Test', entries: [], ts: 12345 };
  lbSaveState('_test_key', state);
  var raw = localStorage.getItem('_test_key');
  assert(raw !== null, 'nothing written');
  assertEqual(JSON.parse(raw).name, 'Test');
});
test('lbLoadState reads back what was saved', function() {
  localStorage.clear();
  var state = { name: 'Round Trip', entries: [{ name: 'E1' }], ts: 1 };
  lbSaveState('_test_rt', state);
  var loaded = lbLoadState('_test_rt');
  assertEqual(loaded.name, 'Round Trip');
  assertEqual(loaded.entries[0].name, 'E1');
});
test('lbLoadState returns null for missing key', function() {
  localStorage.clear();
  assertEqual(lbLoadState('_nonexistent'), null);
});
test('lbSaveState does nothing when key is falsy', function() {
  localStorage.clear();
  lbSaveState(null, { name: 'x', entries: [], ts: 0 });
  lbSaveState('', { name: 'x', entries: [], ts: 0 });
  assertEqual(localStorage.getItem(null), null);
});
test('lbSaveState updates lorebook index', function() {
  localStorage.clear();
  var key = '_lb_test_idx';
  // Seed the index with this key
  lbSaveIndex([{ key: key, name: 'Old Name', ts: 0 }]);
  lbSaveState(key, { name: 'New Name', entries: [], ts: 999 });
  var idx = lbIndex();
  var slot = idx.find(function(x){ return x.key === key; });
  assert(slot, 'key not in index');
  assertEqual(slot.name, 'New Name');
  assertEqual(slot.ts, 999);
});

// ────────────────────────────────────────────────
suite('Lorebook index (lbIndex / lbSaveIndex / lbNewKey / lbMoveToFront)');
// ────────────────────────────────────────────────

test('lbIndex returns empty array when nothing stored', function() {
  localStorage.clear();
  assertEqual(lbIndex(), []);
});
test('lbSaveIndex + lbIndex round-trip', function() {
  localStorage.clear();
  var idx = [{ key: 'a', name: 'A', ts: 1 }, { key: 'b', name: 'B', ts: 2 }];
  lbSaveIndex(idx);
  assertEqual(lbIndex(), idx);
});
test('lbNewKey starts with _lorebook_', function() {
  assert(lbNewKey().startsWith('_lorebook_'), 'key should start with _lorebook_');
});
test('lbNewKey generates unique keys', function() {
  var keys = [lbNewKey(), lbNewKey(), lbNewKey()];
  var unique = new Set(keys);
  assertEqual(unique.size, 3);
});
test('lbMoveToFront promotes entry to index[0]', function() {
  localStorage.clear();
  lbSaveIndex([{ key: 'a', name: 'A', ts: 1 }, { key: 'b', name: 'B', ts: 2 }]);
  lbMoveToFront('b');
  assertEqual(lbIndex()[0].key, 'b');
  assertEqual(lbIndex()[1].key, 'a');
});
test('lbMoveToFront is no-op for missing key', function() {
  localStorage.clear();
  lbSaveIndex([{ key: 'a', name: 'A', ts: 1 }]);
  lbMoveToFront('nonexistent');
  assertEqual(lbIndex()[0].key, 'a');
});

// ────────────────────────────────────────────────
suite('parseImportText — flexible import format');
// ────────────────────────────────────────────────

test('parses === triple-equals blocks', function() {
  var text = [
    '=== Aria the Ranger ===',
    'Type: Character',
    'Triggers: aria, ranger, the ranger',
    'Description: A skilled ranger from the north.',
  ].join('\n');
  var entries = parseImportText(text);
  assertEqual(entries.length, 1);
  assertEqual(entries[0].name, 'Aria the Ranger');
  assertEqual(entries[0].type, 'Character');
  assertEqual(entries[0].triggers, ['aria', 'ranger', 'the ranger']);
});
test('parses Name: key-value format', function() {
  var text = [
    'Name: Iron Keep',
    'Type: Location',
    'Triggers: iron keep, the keep',
    'Description: A fortress in the north.',
  ].join('\n');
  var entries = parseImportText(text);
  assertEqual(entries.length, 1);
  assertEqual(entries[0].name, 'Iron Keep');
  assertEqual(entries[0].type, 'Location');
});
test('parses multiple entries', function() {
  var text = [
    '=== Aria ===',
    'Type: Character',
    '',
    '=== Iron Keep ===',
    'Type: Location',
  ].join('\n');
  var entries = parseImportText(text);
  assertEqual(entries.length, 2);
  assertEqual(entries[0].name, 'Aria');
  assertEqual(entries[1].name, 'Iron Keep');
});
test('auto-detects semicolon delimiter', function() {
  var text = '=== Wizard ===\nType: Character\nTriggers: merlin; the wizard; old man';
  var entries = parseImportText(text);
  assertEqual(entries[0].delim, ';');
  assertEqual(entries[0].triggers, ['merlin', 'the wizard', 'old man']);
});
test('strips markdown bold markers', function() {
  var text = '=== **Aria** ===\nType: Character';
  var entries = parseImportText(text);
  assertEqual(entries[0].name, 'Aria');
});
test('normalises Windows line endings', function() {
  var text = '=== Hero ===\r\nType: Item\r\nTriggers: sword';
  var entries = parseImportText(text);
  assertEqual(entries.length, 1);
  assertEqual(entries[0].name, 'Hero');
});
test('accepts alternate field names: Keywords, Aliases, Category', function() {
  var text = [
    '=== Sword ===',
    'Category: Item',
    'Keywords: sword, blade, the sword',
  ].join('\n');
  var entries = parseImportText(text);
  assertEqual(entries[0].type, 'Item');
  assertEqual(entries[0].triggers, ['sword', 'blade', 'the sword']);
});
test('collects description across multiple lines', function() {
  var text = [
    '=== Castle ===',
    'Type: Location',
    'Description: A large fortress.',
    'Built in ancient times.',
    'Home to many soldiers.',
  ].join('\n');
  var entries = parseImportText(text);
  assertContains(entries[0].description, 'A large fortress.');
  assertContains(entries[0].description, 'Built in ancient times.');
});
test('discards entries with no name', function() {
  var text = 'Type: Character\nTriggers: nobody\nDescription: Orphaned entry.';
  var entries = parseImportText(text);
  assertEqual(entries.length, 0);
});

// ────────────────────────────────────────────────
suite('parseTXT — lorebook template format');
// ────────────────────────────────────────────────

var sampleTXT = [
  'LOREBOOK: Tales of the North',
  '',
  '=== Aria the Ranger ===',
  'Type: Character',
  'Triggers: aria, the ranger',
  'Description: A skilled ranger.',
  '',
  '=== Iron Keep ===',
  'Type: Location',
  'Triggers: iron keep; the keep',
  'Description: A cold fortress.',
].join('\n');

test('parses lorebook name', function() {
  var result = parseTXT(sampleTXT);
  assertEqual(result.lorebookName, 'Tales of the North');
});
test('parses all entries', function() {
  var result = parseTXT(sampleTXT);
  assertEqual(result.entries.length, 2);
});
test('parses entry name from === header', function() {
  var result = parseTXT(sampleTXT);
  assertEqual(result.entries[0].name, 'Aria the Ranger');
});
test('parses entry type', function() {
  var result = parseTXT(sampleTXT);
  assertEqual(result.entries[0].type, 'Character');
});
test('parses triggers with comma delimiter', function() {
  var result = parseTXT(sampleTXT);
  assertEqual(result.entries[0].triggers, ['aria', 'the ranger']);
  assertEqual(result.entries[0].delim, ',');
});
test('parses triggers with semicolon delimiter', function() {
  var result = parseTXT(sampleTXT);
  assertEqual(result.entries[1].triggers, ['iron keep', 'the keep']);
  assertEqual(result.entries[1].delim, ';');
});
test('parses description', function() {
  var result = parseTXT(sampleTXT);
  assertContains(result.entries[0].description, 'A skilled ranger.');
});
test('falls back to parseImportText when no === blocks', function() {
  var text = 'LOREBOOK: Test\nName: Solo\nType: Other\nTriggers: solo';
  var result = parseTXT(text);
  assertEqual(result.entries.length, 1);
  assertEqual(result.entries[0].name, 'Solo');
});
test('handles missing LOREBOOK header gracefully', function() {
  var text = '=== Entry ===\nType: Character';
  var result = parseTXT(text);
  assertEqual(result.lorebookName, '');
  assertEqual(result.entries.length, 1);
});

// ────────────────────────────────────────────────
suite('getSuggestions — trigger suggestion engine');
// ────────────────────────────────────────────────

test('includes full name for any type', function() {
  var sugs = getSuggestions('Aria', 'Character', '');
  assert(sugs.indexOf('aria') !== -1, 'full name should be in suggestions');
});
test('includes first and last name for Character', function() {
  var sugs = getSuggestions('Aria Nightwood', 'Character', '');
  assert(sugs.indexOf('aria') !== -1, 'first name missing');
  assert(sugs.indexOf('nightwood') !== -1, 'last name missing');
});
test('strips title prefixes for Character', function() {
  var sugs = getSuggestions('Lord Aldric Vane', 'Character', '');
  assert(sugs.indexOf('lord aldric vane') !== -1 || sugs.indexOf('aldric vane') !== -1, 'name without title');
  // Should not just be "lord"
  assert(sugs.some(function(s){ return s.includes('aldric'); }), 'core name should appear');
});
test('extracts "known as" aliases from description', function() {
  var sugs = getSuggestions('Aria', 'Character', 'She is known as the Shadow Fox.');
  assert(sugs.some(function(s){ return s.toLowerCase().includes('shadow fox'); }), '"known as" alias missing');
});
test('extracts quoted aliases from description', function() {
  var sugs = getSuggestions('Bob', 'Character', 'People call him "Old Man Bob".');
  assert(sugs.some(function(s){ return s.includes('old man bob'); }), 'quoted alias missing');
});
test('adds "the X" variant for Location', function() {
  var sugs = getSuggestions('Iron Keep', 'Location', '');
  assert(sugs.some(function(s){ return s === 'the iron keep' || s === 'the keep'; }), 'Location: "the X" variant missing');
});
test('extracts individual words for Item', function() {
  var sugs = getSuggestions('Flaming Sword', 'Item', '');
  assert(sugs.indexOf('flaming') !== -1 || sugs.indexOf('sword') !== -1, 'Item: word variants missing');
});
test('returns no duplicates', function() {
  var sugs = getSuggestions('Aria', 'Character', 'Aria is brave.');
  var unique = sugs.filter(function(v,i){ return sugs.indexOf(v)===i; });
  assertEqual(sugs.length, unique.length);
});
test('filters stop words from description', function() {
  var sugs = getSuggestions('X', 'Character', 'She is the most brave warrior in the land.');
  assert(sugs.indexOf('the') === -1, '"the" should be filtered');
  assert(sugs.indexOf('is') === -1, '"is" should be filtered');
  assert(sugs.indexOf('in') === -1, '"in" should be filtered');
});

// ── Results ──────────────────────────────────────────────────────────────────

console.log('\n' + '═'.repeat(50));
var colour = failed === 0 ? '\x1b[32m' : '\x1b[31m';
console.log(colour + '  ' + passed + '/' + total + ' tests passed' + (failed > 0 ? ', ' + failed + ' failed' : '') + '\x1b[0m\n');
process.exit(failed > 0 ? 1 : 0);

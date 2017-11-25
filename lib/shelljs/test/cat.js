import fs from 'fs';

import test from 'ava';

import shell from '..';

shell.config.silent = true;

//
// Invalids
//

test('no paths given', t => {
  const result = shell.cat();
  t.truthy(shell.error());
  t.is(result.code, 1);
  t.is(result.stderr, 'cat: no paths given');
});

test('nonexistent file', t => {
  t.falsy(fs.existsSync('/asdfasdf')); // sanity check
  const result = shell.cat('/asdfasdf'); // file does not exist
  t.truthy(shell.error());
  t.is(result.code, 1);
  t.is(result.stderr, 'cat: no such file or directory: /asdfasdf');
});

test('directory', t => {
  const result = shell.cat('test/resources/cat');
  t.truthy(shell.error());
  t.is(result.code, 1);
  t.is(result.stderr, 'cat: test/resources/cat: Is a directory');
});

//
// Valids
//

test('simple', t => {
  const result = shell.cat('test/resources/cat/file1');
  t.falsy(shell.error());
  t.is(result.code, 0);
  t.is(result.toString(), 'test1\n');
});

test('multiple files', t => {
  const result = shell.cat('test/resources/cat/file2', 'test/resources/cat/file1');
  t.falsy(shell.error());
  t.is(result.code, 0);
  t.is(result.toString(), 'test2\ntest1\n');
});

test('multiple files, array syntax', t => {
  const result = shell.cat(['test/resources/cat/file2', 'test/resources/cat/file1']);
  t.falsy(shell.error());
  t.is(result.code, 0);
  t.is(result.toString(), 'test2\ntest1\n');
});

test('glob', t => {
  const result = shell.cat('test/resources/file*.txt');
  t.falsy(shell.error());
  t.is(result.code, 0);
  t.truthy(result.search('test1') > -1); // file order might be random
  t.truthy(result.search('test2') > -1);
});

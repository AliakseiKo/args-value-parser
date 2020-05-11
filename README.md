# args-value-parser
Parse command line arguments: --key=value.
Parse value as JS data type or structure.

You can specify a prefix, default value for all keys.
You can also specify a prefix, default value and aliases for each key individually.
This module parses undefined, null, boolean, number (NaN, Infinity, bin, oct, hex, e-notation), string, object, array.

* [Install](#install)
* [Usage](#usage)
* [Methods](#methods) <small><sup>[jsDoc][JSDmethods]</sup></small>
    * [parseValue](#parseValue) <small><sup>[jsDoc][JSDparseValue]</sup></small>
    * [parseArg](#parseArg) <small><sup>[jsDoc][JSDparseArg]</sup></small>
    * [parseArgs](#parseArgs) <small><sup>[jsDoc][JSDparseArgs]</sup></small>
    * [argsParser](#argsParser) <small><sup>[jsDoc][JSDargsParser]</sup></small>
* [Examples](#examples)
    * [parseValue](#EXparseValue)
    * [parseArg](#EXparseArg)
    * [parseArgs](#EXparseArgs)
    * [argsParser](#EXargsParser)
* [License](#license)
* [Other](#other)

[JSDmethods]: ./doc/global.html
[JSDparseValue]:./doc/global.html#parseValue
[JSDparseArg]: ./doc/global.html#parseArg
[JSDparseArgs]: ./doc/global.html#parseArgs
[JSDargsParser]: ./doc/global.html#argsParser

## <a name='install'></a> **Install**
```bash
$ npm install args-value-parser
```

## <a name='usage'></a> **Usage**
```js
const { argsParser } = require('args-value-parser');

const args = argsParser();
```
Where can this come in handy?
For example, to comfortable build the project on gulp.

example **gulpfile.js:**
```js
const { src, dest } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const gulpIf = require("gulp-if");

const { argsParser } = require('args-value-parser');

const { prod = false } = argsParser();

const isDev = !prod;

const scripts = () =>
  src('./src/script.js')
  .pipe(gulpIf(isDev, sourcemaps.init()))
  .pipe(babel({ presets: ['@babel/env'] }))
  .pipe(uglify())
  .pipe(gulpIf(isDev, sourcemaps.write()))
  .pipe(dest('./dist/'));

module.exports = { scripts };
```

To build scripts in production (without sourcemaps):

```bash
$ gulp scripts --prod
```

## <a name='methods'></a> **Methods** <small><sup>[jsDoc][JSDmethods]</sup></small>

This module export the following methods:

```js
const { parseValue, parseArg, parseArgs, argsParser } = require('argsParser');
```

### <a name='parseValue'></a> **parseValue`(value)`** <small><sup>[jsDoc][JSDparseValue]</sup></small>
Parses input value as JS data type or structure, if it is possible.
If you wrap the string in extra quotation marks, the value will not be parsed, and additional
quotation marks will be deleted.

* `value` - may be any type, but usually it is a string.

Returns JS data type or structure if the parsing was successful, otherwise the input value.

*example:* <small><sup>[more](#EXparseValue)</sup></small>
```js
parseValue('"[1, 2, 3]"');
  returns '[1, 2, 3]'; // be careful, it is a string.

parseValue('["0.5", -Infinity, null, 0o377, { name: "alex", age: 22 }]');
  returns ['0.5', -Infinity, null, 255, { name: 'alex', age: 22 }];
```

### <a name='parseArg'></a> **parseArg`(arg, prefixes)`** <small><sup>[jsDoc][JSDparseArg]</sup></small>
Parses a string into a prefix, key, value.

* `arg` - string as in the following examples: `'--foo=25'`, `'foo=25'`, `'foo'`, `'bar'`, `'123'`, etc.

* `prefixes = ['-']` - array of strings which can be prefixes.

Returns the object that contains the following properties: `{ key, value, prefix, arg }`.

*example:* <small><sup>[more](#EXparseArg)</sup></small>
```js
parseArg('--foo=25'); // prefixes = ['-'] by default.
  returns { key: 'foo', value: '25', prefix: '--', arg: '--foo=25' };
```

### <a name='parseArgs'></a> **parseArgs`(args, callback, prefixes)`** <small><sup>[jsDoc][JSDparseArgs]</sup></small>
Creates an object from the results of the callback call. Works like Array.prototype.map.

* `args = process.argv` - array of arguments.

* `callback = (key, value) => ({ key, value })` - a function that will be called for each of the array arguments with the following arguments: `(key, value, prefix, arg)`, and the results of its calls will be written to the resulting object. If function returns object which contains key and value properties then result of its call will be written to the resulting object else result will not be written.

* `prefixes = ['-']` - array of strings which can be prefixes.

Returns result object with the following structure: `{ <key>: <value> }`.

*example:* <small><sup>[more](#EXparseArgs)</sup></small>
```js
parseArgs(['--foo=25', '-bar', '_qux='], (key, value) => {
  if (key === 'foo') return { key: 'f', value: value + 5 };
  return { key, value };
}); // prefixes = ['-'] by default.

returns { f: 30, bar: undefined, '_qux': '' };
```

### <a name='argsParser'></a> **argsParser`(args, options, keys)`** <small><sup>[jsDoc][JSDargsParser]</sup></small>
Parses each argument from array of arguments.

* `args = process.argv` - array of arguments.

* `options = { defaultValue: true, parseValue: true, prefix: '-' }` - the options object, sets global options for all arguments (keys).

    * `options.defaultValue = true` - a default value. used if argument value will not passed. For example if we passed `'--foo'` without any value then value of foo would be equal options.defaultValue.

    * `options.parseValue = true` - parse string value as JS data type or structure. For example if we set this property to false then value of passed argument, for example like this `'--foo=true'` will not be boolean, it will be string `'true'`.

    * `options.prefix = '-'` - prefix of argument. For example, in the following string `'--foo=25'` prefix would be `'-'`.

* `keys = {}` - the dictionary object with the following structure: `{ <key>: <keyDescriptor> }`. keyDescriptor is the object describing key's own options. Overrides global options for only specified key. Contains the same properties as the options object and overrides global options for the key that it was specified + it can have aliases array.

    * `keyDescriptor.aliases = []` - an array that contains aliases.

    * `keyDescriptor.defaultValue = options.defaultValue` - a default value. Overrides `options.defaultValue`.

    * `keyDescriptor.parseValue = options.parseValue` - parse string value as JS data type or structure. Overrides `options.parseValue`.

    * `keyDescriptor.prefix = options.parseValue` - prefix of argument. For example, in the following string `'--foo=25'` prefix would be `'-'`. Overrides `options.parseValue`.

Returns result object with the following structure: `{ <key>: <value> }`.

*example:* <small><sup>[more](#EXargsParser)</sup></small>
```js
const args = ['--foo=25', '__bar', '-Q'];
const options = { defaultValue: 500, prefix: '_' };
const keys = {
  qux: { aliases: ['Q'], defaultValue: true, prefix: '-' }
};

argsParser(args, options, keys);
  returns { bar: 500, qux: true };
```

## <a name='examples'></a> **Examples**

usage with cli

**example.js:**
```js
const { argsParser } = require('args-value-parser');

const args = argsParser();

console.log(args);
```

***

**console input:**
```bash
$ node example.js --foo --bar=null --baz=-0.0035 --qux='Hello World!'
```

**console output:**
```js
{ foo: true, bar: null, baz: -0.0035, qux: 'Hello World!' }
```

***

**console input:**
```bash
$ node example.js --foo='[0.5, -Infinity, NaN, "", [1, 2, 3], true]'
```

**console output:**
```js
{ foo: [0.5, -Infinity, NaN, '', [1, 2, 3], true] }
```

***

**console input:**
```bash
$ node example.js --foo='{ name: "alex", age: 22, married: false }'
```

**console output:**
```js
{ foo: { name: 'alex', age: 22, married: false } }
```

### **[parseValue](#parseValue):** <a name="EXparseValue"></a>

```js
parseValue('undefined');
  returns undefined;
```
```js
parseValue('null');
  returns null;
```
```js
parseValue('true');
  returns true;
```
```js
parseValue('-0.25');
  returns -0.25;
```
```js
parseValue('123e-2'); // it an e-notation
  returns 1.23;
```
```js
parseValue('0xff'); // it is an hexadecimal numeral system
  returns 255;
```
```js
parseValue('0b11111111'); // it is a binary numeral system
  returns 255;
```
```js
parseValue('0o377'); // it is an octal numeral system
  returns 255;
```
```js
parseValue('NaN');
  returns 1.23;
```
```js
parseValue('-Infinity');
  returns -Infinity;
```
```js
parseValue('Hello World!');
  returns 'Hello World!';
```
```js
parseValue('[1, NaN, 3, -Infinity]');
  returns [1, NaN, 3, -Infinity];
```
```js
parseValue('{ name: alex, "age": 22 }');
  returns { name: alex, age: 22 };
```
```js
parseValue('"undefined"');
  returns 'undefined'; // it is a string!
```

### **[parseArg](#parseArg):** <a name="EXparseArg"></a>

If you do not write an equal sign in the line, the value will be `undefined`.
```js
parseArg('--foo');
  returns { key: 'foo', value: undefined, prefix: '--', arg: '--foo' };
```
If you write an equal sign in the line, but not to write the value, it will be `''`.
```js
parseArg('--foo=');
  returns { key: 'foo', value: '', prefix: '--', arg: '--foo=' };
```
Without prefixes.
```js
parseArg('--foo=25', ['']);
  returns { key: '--foo', value: '25', prefix: '', arg: '--foo=25' };
```
With several prefixes.
```js
parseArg('__foo=25', ['-', '_']);
  returns { key: '-foo=25', value: '25', prefix: '_', arg: '_-foo=25' };
```

### **[parseArgs](#parseArgs):** <a name="EXparseArgs"></a>
As you might have guessed, argsParser also uses this function. For example you can create your own function of this kind.
```js
// We will need parsArgs and parseValue functions. Export them.
const { parsArgs, parseValue } = require('args-value-parser');

// Create our own parser.
function ourParser(args, defaultValue, type) {
  // Create out callback function which will be called on each argument from array of arguments.
  // Callback can accept key, value, prefix, arg.
  function argHandler(key, value, prefix) {
    // Stop the hendling if prefix length is not 2 and prefix character is not - .
    if (prefix.length !== 2 || prefix.charAt(0) !== '-') return;

    // Convert string to javascript type. For example string '25' will be number 25.
    const JSValue = parseValue(value);

    // Set value to parsed value if parsed value type is equal to the desired type.
    // otherwise set value to the defaultValue.
    if (typeof JSValue === type) {
      value = JSValue;
    } else {
      value = defaultValue;
    }

    // return handling result.
    return { key, value };
  }

  // Call parseArgs and pass it the input array of arguments and our handler.
  // parseArgs will call our handler on each of arguments
  // with the following parameters: key, value, prefix, arg.
  return parseArgs(args, argHandler);
}

ourParser([
  '--foo',
  '--bar=false',
  '--baz=25',
  '--qux=[1, 2, 3]'
], true, 'number');

returns {
  foo: true,
  bar: true,
  baz: 25,
  qux: true }
```

### **[argsParser](#argsParser):** <a name="EXargsParser"></a>

with the default `options`

```js
const args = [
  '--foo',
  '--bar=',
  '--qux=25'
];

argsParser(args);

returns {
  foo: true,
  bar: '',
  qux: 25
};
```

with the `options.defaultValue`

```js
const args = [
  '--foo',
  '--bar=',
  '--qux=25'
];

const options = { defaultValue: [1, NaN, 3] };

argsParser(args, options);

returns {
  foo: [1, NaN, 3],
  bar: '',
  qux: 25
};
```

with the `options.parseValue`

```js
const args = [
  '--foo',
  '--bar=',
  '--qux=25'
];

const options = { parseValue: false };

argsParser(args, options);

returns {
  foo: true,
  bar: '',
  qux: '25' // is a string.
};
```

with the `options.prefix`

```js
const args = [
  'foo=5', // will not be parsed because there is no prefix
  '-bar=10', // will not be parsed because prefix set to '_'
  '--baz=15', // will not be parsed because prefix set to '_'
  '---qux=20', // will not be parsed because prefix set to '_'
  '_osе=25', // will not be parsed because prefix must be 2 characters long
  '__rol=30', // will be parsed, everything is OK :)
  '___zed=35' // will not be parsed because prefix must be 2 characters long
];
const options = { prefix: '_' };

argsParser(args, options);

returns { rol: 30 };
```

with the `options.prefix = ''`

```js
const args = [
  'foo=5',
  '-bar=10',
  '--baz=15',
  '---qux=20',
  '_osе=25',
  '__rol=30',
  '___zed=35'
];
const options = { prefix: '' };

argsParser(args, options);

returns {
  foo: 5,
  '-bar': 10,
  '--baz': 15,
  '---qux': 20,
  _osе: 25,
  __rol: 30,
  ___zed: 35
};
```

with default `options` and `keyDescriptor.aliases`

```js
const args = [
  '-fo',
  '-B=25',
  '-Bz=null',
  '--q=NaN',
  '--ose=false'
];
const keys = {
  foo: { aliases: ['f', 'fo'] },
  bar: { aliases: ['B'] },
  baz: { aliases: ['Bz'] },
  q: { aliases: ['q', 'qx'] },
  ose: { aliases: ['o'] }
};

argsParser(args, undefined, keys);

returns {
  foo: true,
  bar: 25,
  baz: null,
  qux: NaN,
  ose: false
};
```

with `options.defaultValue` and `keyDescriptor.defaultValue`

```js
const args = [
  '--foo',
  '--bar',
  '--qux=25'
];
const options = { defaultValue: false };
const keys = {
  bar: { defaultValue: [1, NaN, 3] },
  qux: { defaultValue: null }
};

argsParser(args, options, keys);

returns {
  foo: false,
  bar: [1, NaN, 3],
  qux: 25
};
```

with `options.parseValue` and `keyDescriptor.parseValue`

```js
const args = [
  '--foo=null',
  '--bar=false',
  '--qux=25'
];
const options = { parseValue: false };
const keys = {
  bar: { parseValue: true },
  qux: { parseValue: true }
};

argsParser(args, options, keys);

returns {
  foo: 'null',
  bar: false,
  qux: 25
};
```

with `options.prefix` and `keyDescriptor.prefix`

```js
const args = [
  '--foo=null', // will not be parsed because global prefix set to '_' and this key was not specified with an individual prefix.
  '--bar=false', // will be parsed because this key specified with individual prefix = '-'.
  '++baz=-Infinity', // will be parsed because this key specified with individual prefix = '-'.
  '__qux=25', // will be parsed because global prefix set to '_'
  '++++osе', // will be parsed because this key specified with individual prefix = ''.
  'rol=0.25' // will be parsed because this key specified with individual prefix = ''.
];
const options = { prefix: '_' };
const keys = {
  bar: { prefix: '-' },
  baz: { prefix: '+' },
  '++++osе': { prefix: '' },
  rol: { prefix: '' }
};

argsParser(args, options, keys);

returns {
  bar: false,
  baz: -Infinity,
  qux: 25,
  '++++osе': true,
  rol: 0.25
};
```

with `options.prefix = ''` and `keyDescriptor.prefix`

```js
const args = [
  '--foo=null',
  '--bar=false',
  '++baz=-Infinity',
  '__qux',
  '++++osе=25',
  'rol=0.25'
];
const options = { prefix: '' };
const keys = {
  bar: { prefix: '-' },
  '++++osе': { prefix: '+' }
};

argsParser(args, options, keys);

returns {
  '--foo': null,
  bar: false,
  '++baz': -Infinity,
  __qux: true,
  '++++osе': 25,
  rol: 0.25
};
```

Identical keys will be overwritten.

```js
const args = [
  '--foo=5',
  '--foo=10'
];

argsParser(args);

returns {
  foo: 10 // value is overwritten by the value of last argument with the same key.
};
```

The specified keys take precedence.

```js
const args = [
  '__foo=5',
  '--foo=10'
];

const keys = {
  foo: { prefix: '_' }
};

argsParser(args, undefined, keys);

returns {
  foo: 5,
  '--foo': 10 // despite the fact that --foo is fully valid for parsing, we cannot write its value to the foo key because it is already reserved for __foo. But due to the fact that the argument is still valid we can write it as is (with its prefix).
};
```

Specified keys is overriding global options.

```js
const args = [
  '--foo',
  '--bar',
  '--baz=null',
  '__qux=[1, 2, 3]'
];

const options = {
  defaultValue: true,
  parseValue: true,
  prefix: '-'
};

const keys = {
  bar: { defaultValue: 10 },
  baz: { parseValue: false },
  qux: { prefix: '_' }
};

argsParser(args, options, keys);

returns {
  foo: true,
  bar: 10,
  baz: 'null',
  qux: [1, 2, 3]
};
```

## <a name='license'></a> **license**

[MIT](https://github.com/AliakseiKo/args-value-parser/blob/master/LICENSE)

## <a name="other"></a> **Other**
This module use modified [JSON5](https://json5.org/)<small><sup>[license](https://github.com/json5/json5/blob/master/LICENSE.md)</sup></small> parse function.

/* eslint-env jest */
const { argsParser, parseArgs, parseArg, parseValue } = require('../lib/index');

describe(parseValue, () => {
  it('must parse undefined', () => {
    expect(parseValue('undefined')).toEqual(undefined);
  });

  it('must parse null', () => {
    expect(parseValue('null')).toEqual(null);
  });

  it('must parse boolean', () => {
    expect(parseValue('true')).toEqual(true);
    expect(parseValue('false')).toEqual(false);
  });

  it.each([
    ['0', 0],
    ['+0', 0],
    ['-0', -0],
    ['0.5', 0.5],
    ['+0.5', 0.5],
    ['-0.5', -0.5],
    ['123e-2', 1.23],
    ['+123e-2', 1.23],
    ['-123e-2', -1.23],
    ['0x2f0D', 12045],
    ['+0x2f0D', 12045],
    ['-0x2f0D', -12045],
    ['0b1111111', 127],
    ['+0b1111111', 127],
    ['-0b1111111', -127],
    ['0o347', 231],
    ['+0o347', 231],
    ['-0o347', -231],
    ['Infinity', Infinity],
    ['+Infinity', +Infinity],
    ['-Infinity', -Infinity],
    ['NaN', NaN]
  ])('must parse string(%s) to number(%i)', (value, expected) => {
    expect(parseValue(value)).toEqual(expected);
  });

  it('must parse string', () => {
    expect(parseValue('"250"')).toEqual('250');
    expect(parseValue('Hello World!')).toEqual('Hello World!');
  });

  it('must parse array', () => {
    expect(parseValue('[undefined, null, true, false, 250, -Infinity, "Hello World!"]'))
      .toEqual([undefined, null, true, false, 250, -Infinity, "Hello World!"]);
  });

  it('must parse object', () => {
    expect(parseValue('{ name: "alex", \'age\': 22, "married": false }'))
      .toEqual({ name: 'alex', age: 22, married: false });
  });
});

describe(parseArg, () => {
  it.each([
    ['--key=value', { prefix: '--', key: 'key', value: 'value',   arg: '--key=value' }],
    ['--key',       { prefix: '--', key: 'key', value: undefined, arg: '--key' }],
    ['key',         { prefix: '',   key: 'key', value: undefined, arg: 'key' }],
    ['--key=',      { prefix: '--', key: 'key', value: '',        arg: '--key=' }],
    ['--',          { prefix: '--', key: '',    value: undefined, arg: '--' }],
    ['=value',      { prefix: '',   key: '',    value: 'value',   arg: '=value' }],
    ['--=value',    { prefix: '--', key: '',    value: 'value',   arg: '--=value' }],
    ['=',           { prefix: '',   key: '',    value: '',        arg: '=' }]
  ])('must parse argument(%s) with default prefix (-) correctly', (arg, expected) => {
    expect(parseArg(arg)).toEqual(expected);
  });

  it.each([
    ['--key=value', [''], { prefix: '', key: '--key', value: 'value',   arg: '--key=value' }],
    ['--key',       [''], { prefix: '', key: '--key', value: undefined, arg: '--key' }],
    ['key',         [''], { prefix: '', key: 'key',   value: undefined, arg: 'key' }],
    ['--key=',      [''], { prefix: '', key: '--key', value: '',        arg: '--key=' }],
    ['--',          [''], { prefix: '', key: '--',    value: undefined, arg: '--' }],
    ['=value',      [''], { prefix: '', key: '',      value: 'value',   arg: '=value' }],
    ['--=value',    [''], { prefix: '', key: '--',    value: 'value',   arg: '--=value' }],
    ['=',           [''], { prefix: '', key: '',      value: '',        arg: '=' }]
  ])('must parse argument(%s) without prefix correctly', (arg, prefixes, expected) => {
    expect(parseArg(arg, prefixes)).toEqual(expected);
  });

  it.each([
    ['--key=value', ['_'],  { prefix: '', key: '--key', value: 'value',   arg: '--key=value' }],
    ['--key',       ['_'],  { prefix: '', key: '--key', value: undefined, arg: '--key' }],
    ['key',         ['_'],  { prefix: '', key: 'key',   value: undefined, arg: 'key' }],
    ['--key=',      ['_'],  { prefix: '', key: '--key', value: '',        arg: '--key=' }],
    ['--',          ['_'],  { prefix: '', key: '--',    value: undefined, arg: '--' }],
    ['=value',      ['_'],  { prefix: '', key: '',      value: 'value',   arg: '=value' }],
    ['--=value',    ['_'],  { prefix: '', key: '--',    value: 'value',   arg: '--=value' }],
    ['=',           ['_'],  { prefix: '', key: '',      value: '',        arg: '=' }],

    ['__key=value', ['_'], { prefix: '__', key: 'key',  value: 'value',   arg: '__key=value' }],
    ['__key',       ['_'], { prefix: '__', key: 'key',  value: undefined, arg: '__key' }],
    ['key',         ['_'], { prefix: '',   key: 'key',  value: undefined, arg: 'key' }],
    ['__key=',      ['_'], { prefix: '__', key: 'key',  value: '',        arg: '__key=' }],
    ['__',          ['_'], { prefix: '__', key: '',     value: undefined, arg: '__' }],
    ['=value',      ['_'], { prefix: '',   key: '',     value: 'value',   arg: '=value' }],
    ['__=value',    ['_'], { prefix: '__', key: '',     value: 'value',   arg: '__=value' }],
    ['=',           ['_'], { prefix: '',   key: '',     value: '',        arg: '=' }]
  ])('must parse argument(%s) with other prefix (_) correctly', (arg, prefixes, expected) => {
    expect(parseArg(arg, prefixes)).toEqual(expected);
  });

  it.each([
    ['--key=value', ['\\', '$'], { prefix: '', key: '--key',  value: 'value',   arg: '--key=value' }],
    ['--key',       ['\\', '$'], { prefix: '', key: '--key',  value: undefined, arg: '--key' }],
    ['key',         ['\\', '$'], { prefix: '', key: 'key',    value: undefined, arg: 'key' }],
    ['--key=',      ['\\', '$'], { prefix: '', key: '--key',  value: '',        arg: '--key=' }],
    ['--',          ['\\', '$'], { prefix: '', key: '--',     value: undefined, arg: '--' }],
    ['=value',      ['\\', '$'], { prefix: '', key: '',       value: 'value',   arg: '=value' }],
    ['--=value',    ['\\', '$'], { prefix: '', key: '--',     value: 'value',   arg: '--=value' }],
    ['=',           ['\\', '$'], { prefix: '', key: '',       value: '',        arg: '=' }],

    ['\\\\key=value', ['\\', '$'], { prefix: '\\\\', key: 'key',  value: 'value',   arg: '\\\\key=value' }],
    ['\\\\key',       ['\\', '$'], { prefix: '\\\\', key: 'key',  value: undefined, arg: '\\\\key' }],
    ['key',           ['\\', '$'], { prefix: '',     key: 'key',  value: undefined, arg: 'key' }],
    ['\\\\key=',      ['\\', '$'], { prefix: '\\\\', key: 'key',  value: '',        arg: '\\\\key=' }],
    ['\\\\',          ['\\', '$'], { prefix: '\\\\', key: '',     value: undefined, arg: '\\\\' }],
    ['=value',        ['\\', '$'], { prefix: '',     key: '',     value: 'value',   arg: '=value' }],
    ['\\\\=value',    ['\\', '$'], { prefix: '\\\\', key: '',     value: 'value',   arg: '\\\\=value' }],
    ['=',             ['\\', '$'], { prefix: '',     key: '',     value: '',        arg: '=' }],

    ['$$key=value', ['\\', '$'], { prefix: '$$', key: 'key',  value: 'value',   arg: '$$key=value' }],
    ['$$key',       ['\\', '$'], { prefix: '$$', key: 'key',  value: undefined, arg: '$$key' }],
    ['key',         ['\\', '$'], { prefix: '',   key: 'key',  value: undefined, arg: 'key' }],
    ['$$key=',      ['\\', '$'], { prefix: '$$', key: 'key',  value: '',        arg: '$$key=' }],
    ['$$',          ['\\', '$'], { prefix: '$$', key: '',     value: undefined, arg: '$$' }],
    ['=value',      ['\\', '$'], { prefix: '',   key: '',     value: 'value',   arg: '=value' }],
    ['$$=value',    ['\\', '$'], { prefix: '$$', key: '',     value: 'value',   arg: '$$=value' }],
    ['=',           ['\\', '$'], { prefix: '',   key: '',     value: '',        arg: '=' }],

    ['\\$key=value',  ['\\', '$'], { prefix: '\\', key: '$key', value: 'value',   arg: '\\$key=value' }],
    ['\\$key',        ['\\', '$'], { prefix: '\\', key: '$key', value: undefined, arg: '\\$key' }],
    ['key',           ['\\', '$'], { prefix: '',   key: 'key',  value: undefined, arg: 'key' }],
    ['\\$key=',       ['\\', '$'], { prefix: '\\', key: '$key', value: '',        arg: '\\$key=' }],
    ['\\$',           ['\\', '$'], { prefix: '\\', key: '$',    value: undefined, arg: '\\$' }],
    ['=value',        ['\\', '$'], { prefix: '',   key: '',     value: 'value',   arg: '=value' }],
    ['\\$=value',     ['\\', '$'], { prefix: '\\', key: '$',    value: 'value',   arg: '\\$=value' }],
    ['=',             ['\\', '$'], { prefix: '',   key: '',     value: '',        arg: '=' }],

    ['$\\key=value',  ['\\', '$'], { prefix: '$',  key: '\\key',  value: 'value',   arg: '$\\key=value' }],
    ['$\\key',        ['\\', '$'], { prefix: '$',  key: '\\key',  value: undefined, arg: '$\\key' }],
    ['key',           ['\\', '$'], { prefix: '',   key: 'key',    value: undefined, arg: 'key' }],
    ['$\\key=',       ['\\', '$'], { prefix: '$',  key: '\\key',  value: '',        arg: '$\\key=' }],
    ['$\\',           ['\\', '$'], { prefix: '$',  key: '\\',     value: undefined, arg: '$\\' }],
    ['=value',        ['\\', '$'], { prefix: '',   key: '',       value: 'value',   arg: '=value' }],
    ['$\\=value',     ['\\', '$'], { prefix: '$',  key: '\\',     value: 'value',   arg: '$\\=value' }],
    ['=',             ['\\', '$'], { prefix: '',   key: '',       value: '',        arg: '=' }]
  ])('must parse argument(%s) with several prefixes (\\$) correctly', (arg, prefixes, expected) => {
    expect(parseArg(arg, prefixes)).toEqual(expected);
  });
});

describe(parseArgs, () => {
  it('must parse arguments correctly by default', () => {
    expect(parseArgs(['--key1=value1', '--key2', 'key3', '--key4=', '--', '=value6', '--=value7', '=']))
      .toEqual({ key1: 'value1', key2: undefined, key4: '' });
  });

  it('must parse arguments correctly with prefix = _', () => {
    expect(parseArgs(['--key1=value1', '__key2', '_key3=', '--key4', '-key5', '=value6', '--=value7', '='], undefined, ['_']))
      .toEqual({ key2: undefined, key3: '' });
  });
});

describe(argsParser, () => {
  it('must overwrite the identical keys to the value of last argument with the same key', () => {
    expect(argsParser([
      '--foo=5',
      '--foo=10'
    ])).toEqual({
      foo: 10
    });

    expect(argsParser([
      '--foo=5',
      '--bar=true',
      '--foo=10',
      '--bar=false'
    ])).toEqual({
      foo: 10,
      bar: false
    });
  });

  it('The specified keys take precedence', () => {
    expect(argsParser(
      [
        '__foo=5',
        '--foo=10'
      ],
      undefined,
      {
        foo: { prefix: '_' }
      }
    )).toEqual({
      foo: 5,
      '--foo': 10
    });

    expect(argsParser(
      [
        '--foo=10',
        '__foo=5'
      ],
      undefined,
      {
        foo: { prefix: '_' }
      }
    )).toEqual({
      foo: 5,
      '--foo': 10
    });
  });

  it('Specified keys is overriding global options', () => {
    expect(argsParser(
      [
        '--key1',
        '--key2',
        '--key3=null',
        '__key4=[1, 2, 3]'
      ],
      {
        defaultValue: true,
        parseValue: true,
        prefix: '-'
      },
      {
        key2: {
          defaultValue: 10
        },
        key3: {
          parseValue: false
        },
        key4: {
          prefix: '_'
        }
      }
    )).toEqual({
      key1: true,
      key2: 10,
      key3: 'null',
      key4: [1, 2, 3]
    });
  });

  it('must parse arguments correctly with default parameters', () => {
    expect(argsParser([
      '--key1',
      '--key2=',
      '--key3="null"',
      '--key4=[undefined, 0.5, +Infinity, false, [1, NaN, 3], { name: "alex", \'age\': 22, "married": false }, null]',
    ])).toEqual({
      key1: true,
      key2: '',
      key3: 'null',
      key4: [undefined, 0.5, +Infinity, false, [1, NaN, 3], { name: 'alex', age: 22, married: false }, null]
    });

    expect(argsParser([
      'key1=5',
      '-key2=10',
      '--key3=15',
      '---key4=20',
      '_key5=25',
      '__key6=30',
      '___key7=35'
    ])).toEqual({ key3: 15 });
  });

  it.each([
    [
      ['--key1', '--key2='],
      { defaultValue: undefined },
      { key1: undefined, key2: '' }
    ],
    [
      ['--key1', '--key2='],
      { defaultValue: null },
      { key1: null, key2: '' }
    ],
    [
      ['--key1', '--key2='],
      { defaultValue: true },
      { key1: true, key2: '' }
    ],
    [
      ['--key1', '--key2='],
      { defaultValue: false },
      { key1: false, key2: '' }
    ],
    [
      ['--key1', '--key2='],
      { defaultValue: 0 },
      { key1: 0, key2: '' }
    ],
    [
      ['--key1', '--key2='],
      { defaultValue: 0.5 },
      { key1: 0.5, key2: '' }
    ],
    [
      ['--key1', '--key2='],
      { defaultValue: -0.5 },
      { key1: -0.5, key2: '' }
    ],
    [
      ['--key1', '--key2='],
      { defaultValue: Infinity },
      { key1: Infinity, key2: '' }
    ],
    [
      ['--key1', '--key2='],
      { defaultValue: +Infinity },
      { key1: +Infinity, key2: '' }
    ],
    [
      ['--key1', '--key2='],
      { defaultValue: -Infinity },
      { key1: -Infinity, key2: '' }
    ],
    [
      ['--key1', '--key2='],
      { defaultValue: NaN },
      { key1: NaN, key2: '' }
    ],
    [
      ['--key1', '--key2='],
      { defaultValue: 'Hello World!' },
      { key1: 'Hello World!', key2: '' }
    ],
    [
      ['--key1', '--key2='],
      { defaultValue: { name: 'alex', age: 22, married: false } },
      { key1: { name: 'alex', age: 22, married: false }, key2: '' }
    ],
    [
      ['--key1', '--key2='],
      { defaultValue: [null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"] },
      { key1: [null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"], key2: '' }
    ]
  ])('must parse arguments correctly with given global defaultValue', (args, options, expected) => {
    expect(argsParser(args, options)).toEqual(expected);
  });

  it('must parse arguments correctly with given global parseValue', () => {
    expect(argsParser(
      [
        '--key1=[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]',
        '--key2="[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]"'
      ],
      { parseValue: true }
    )).toEqual({
      key1: [null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, 'Hello World!'],
      key2: '[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]'
    });

    expect(argsParser(
      [
        '--key1=[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]',
        '--key2="[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]"'
      ],
      {
        parseValue: false
      }
    )).toEqual({
      key1: '[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]',
      key2: '"[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]"'
    });
  });

  it('must parse arguments correctly with given global prefix', () => {
    expect(argsParser(
      [
        'key1=5',
        '+key2=10',
        '++key3=15',
        '+++key4=20',
        '-key5=25',
        '--key6=30',
        '---key7=35'
      ],
      {
        prefix: '+'
      }
    )).toEqual({ key3: 15 });

    expect(argsParser(
      [
        'key1=5',
        '-key2=10',
        '--key3=15',
        '---key4=20',
        '_key5=25',
        '__key6=30',
        '___key7=35'
      ],
      {
        prefix: ''
      }
    )).toEqual({
      key1: 5,
      '-key2': 10,
      '--key3': 15,
      '---key4': 20,
      _key5: 25,
      __key6: 30,
      ___key7: 35
    });
  });

  it('must parse arguments correctly with aliases', () => {
    expect(argsParser(
      [
        '-fo',
        '-B=25',
        '-Bz=null',
        '--q=NaN',
        '--ose=false'
      ],
      undefined,
      {
        foo: { aliases: ['f', 'fo'] },
        bar: { aliases: ['B'] },
        baz: { aliases: ['Bz'] },
        qux: { aliases: ['q', 'qx'] },
        ose: { aliases: ['o'] }
      }
    )).toEqual({
      foo: true,
      bar: 25,
      baz: null,
      q: NaN,
      ose: false
    });
  });

  {
    const keysWithAlias1 = {
      foo: {
        aliases: ['f', 'fo'],
        defaultValue: 5
      }
    };

    const keysWithAlias2 = {
      foo: {
        aliases: ['f', 'fo'],
        defaultValue: 5,
        prefix: '-'
      }
    };

    const keysWithAlias3 = {
      '--foo': {
        aliases: ['-f', '-fo'],
        defaultValue: 5
      }
    };

    const keysWithAlias4 = {
      '--foo': {
        aliases: ['+f', '+fo'],
        defaultValue: 5
      }
    };

    it.each([
      [['--foo'], {}, keysWithAlias1, { foo: 5 }],
      [['-f'], {}, keysWithAlias1, { foo: 5 }],
      [['-fo'], {}, keysWithAlias1, { foo: 5 }],
      [['--foo'], { prefix: '' }, keysWithAlias2, { foo: 5 }],
      [['-f'], { prefix: '' }, keysWithAlias2, { foo: 5 }],
      [['-fo'], { prefix: '' }, keysWithAlias2, { foo: 5 }],
      [['--foo'], { prefix: '' }, keysWithAlias3, { '--foo': 5 }],
      [['-f'], { prefix: '' }, keysWithAlias3, { '--foo': 5 }],
      [['-fo'], { prefix: '' }, keysWithAlias3, { '--foo': 5 }],
      [['--foo'], { prefix: '' }, keysWithAlias4, { '--foo': 5 }],
      [['+f'], { prefix: '' }, keysWithAlias4, { '--foo': 5 }],
      [['+fo'], { prefix: '' }, keysWithAlias4, { '--foo': 5 }]
    ])('must parse arguments correctly with aliases and overriding options', (args, options, keys, expected) => {
      expect(argsParser(args, options, keys)).toEqual(expected);
    });
  }

  it('must parse arguments correctly with keys', () => {
    // with global prefix
    expect(argsParser(
      [
        '--key1',
        '__key2=[1, 2, 3]',
        '__key3=0.5',
        '__key4=null',
        'somekey=Hello World!'
      ],
      {
        prefix: '-'
      },
      {
        key2: {
          prefix: '_'
        },
        '__key3': {
          prefix: ''
        },
        somekey: {
          prefix: ''
        }
      }
    )).toEqual({
      key1: true,
      key2: [1, 2, 3],
      '__key3': 0.5,
      somekey: 'Hello World!'
    });

    // without global prefix
    expect(argsParser(
      [
        '--key1',
        '__key2=[1, 2, 3]',
        '__key3=0.5',
        '__key4=null',
        'somekey=Hello World!'
      ],
      {
        prefix: ''
      },
      {
        key1: {
          prefix: '-'
        },
        key2: {
          prefix: '_'
        }
      }
    )).toEqual({
      key1: true,
      key2: [1, 2, 3],
      '__key3': 0.5,
      '__key4': null,
      somekey: 'Hello World!'
    });
  });
});

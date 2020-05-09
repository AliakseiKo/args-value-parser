/* eslint-env jest */
const { argsParser, parseArgs, parseArg, parseValue } = require('../src/index');

describe('parseValue function', () => {
  test('must parse undefined', () => {
    expect(parseValue('undefined')).toEqual(undefined);
  });

  test('must parse null', () => {
    expect(parseValue('null')).toEqual(null);
  });

  test('must parse boolean', () => {
    expect(parseValue('true')).toEqual(true);
    expect(parseValue('false')).toEqual(false);
  });

  test('must parse number', () => {
    expect(parseValue('0')).toEqual(0);
    expect(parseValue('+0')).toEqual(0);
    expect(parseValue('-0')).toEqual(0);
    expect(parseValue('0.5')).toEqual(0.5);
    expect(parseValue('+0.5')).toEqual(0.5);
    expect(parseValue('-0.5')).toEqual(-0.5);
    expect(parseValue('123e-2')).toEqual(1.23);
    expect(parseValue('+123e-2')).toEqual(1.23);
    expect(parseValue('-123e-2')).toEqual(-1.23);
    expect(parseValue('0x2f0D')).toEqual(12045);
    expect(parseValue('+0x2f0D')).toEqual(12045);
    expect(parseValue('-0x2f0D')).toEqual(-12045);
    expect(parseValue('0b1111111')).toEqual(127);
    expect(parseValue('+0b1111111')).toEqual(127);
    expect(parseValue('-0b1111111')).toEqual(-127);
    expect(parseValue('0o347')).toEqual(231);
    expect(parseValue('+0o347')).toEqual(231);
    expect(parseValue('-0o347')).toEqual(-231);
    expect(parseValue('Infinity')).toEqual(Infinity);
    expect(parseValue('+Infinity')).toEqual(+Infinity);
    expect(parseValue('-Infinity')).toEqual(-Infinity);
    expect(parseValue('NaN')).toEqual(NaN);
  });

  test('must parse string', () => {
    expect(parseValue('"250"')).toEqual('250');

    expect(parseValue('Hello World!')).toEqual('Hello World!');
    expect(parseValue('"Hello World!"')).toEqual('Hello World!');
    expect(parseValue('\'Hello World!\'')).toEqual('Hello World!');
  });

  test('must parse array', () => {
    expect(parseValue('[undefined, null, true, false, 250, -Infinity, "Hello World!"]'))
      .toEqual([undefined, null, true, false, 250, -Infinity, "Hello World!"]);
  });

  test('must parse object', () => {
    expect(parseValue('{ name: "alex", \'age\': 22, "married": false }'))
      .toEqual({ name: 'alex', age: 22, married: false });
  });
});

describe('parseArg function', () => {
  test('must parse argument with default prefix (-) correctly', () => {
    expect(parseArg('--key=value'))
      .toEqual({ key: 'key', value: 'value', prefix: '--', arg: '--key=value' });
    expect(parseArg('--key'))
      .toEqual({ key: 'key', value: undefined, prefix: '--', arg: '--key' });
    expect(parseArg('key'))
      .toEqual({ key: 'key', value: undefined, prefix: '', arg: 'key' });
    expect(parseArg('--key='))
      .toEqual({ key: 'key', value: '', prefix: '--', arg: '--key=' });
    expect(parseArg('--'))
      .toEqual({ key: '', value: undefined, prefix: '--', arg: '--' });
    expect(parseArg('=value'))
      .toEqual({ key: '', value: 'value', prefix: '', arg: '=value' });
    expect(parseArg('--=value'))
      .toEqual({ key: '', value: 'value', prefix: '--', arg: '--=value' });
    expect(parseArg('='))
      .toEqual({ key: '', value: '', prefix: '', arg: '=' });
  });

  test('must parse argument without prefix correctly', () => {
    expect(parseArg('--key=value', ['']))
      .toEqual({ key: '--key', value: 'value', prefix: '', arg: '--key=value' });
    expect(parseArg('--key', ['']))
      .toEqual({ key: '--key', value: undefined, prefix: '', arg: '--key' });
    expect(parseArg('key', ['']))
      .toEqual({ key: 'key', value: undefined, prefix: '', arg: 'key' });
    expect(parseArg('--key=', ['']))
      .toEqual({ key: '--key', value: '', prefix: '', arg: '--key=' });
    expect(parseArg('--', ['']))
      .toEqual({ key: '--', value: undefined, prefix: '', arg: '--' });
    expect(parseArg('=value', ['']))
      .toEqual({ key: '', value: 'value', prefix: '', arg: '=value' });
    expect(parseArg('--=value', ['']))
      .toEqual({ key: '--', value: 'value', prefix: '', arg: '--=value' });
    expect(parseArg('=', ['']))
      .toEqual({ key: '', value: '', prefix: '', arg: '=' });
  });

  test('must parse argument with other prefix (_) correctly', () => {
    expect(parseArg('--key=value', ['_']))
      .toEqual({ key: '--key', value: 'value', prefix: '', arg: '--key=value' });
    expect(parseArg('--key', ['_']))
      .toEqual({ key: '--key', value: undefined, prefix: '', arg: '--key' });
    expect(parseArg('key', ['_']))
      .toEqual({ key: 'key', value: undefined, prefix: '', arg: 'key' });
    expect(parseArg('--key=', ['_']))
      .toEqual({ key: '--key', value: '', prefix: '', arg: '--key=' });
    expect(parseArg('--', ['_']))
      .toEqual({ key: '--', value: undefined, prefix: '', arg: '--' });
    expect(parseArg('=value', ['_']))
      .toEqual({ key: '', value: 'value', prefix: '', arg: '=value' });
    expect(parseArg('--=value', ['_']))
      .toEqual({ key: '--', value: 'value', prefix: '', arg: '--=value' });
    expect(parseArg('=', ['_']))
      .toEqual({ key: '', value: '', prefix: '', arg: '=' });

    expect(parseArg('__key=value', ['_']))
      .toEqual({ key: 'key', value: 'value', prefix: '__', arg: '__key=value' });
    expect(parseArg('__key', ['_']))
      .toEqual({ key: 'key', value: undefined, prefix: '__', arg: '__key' });
    expect(parseArg('key', ['_']))
      .toEqual({ key: 'key', value: undefined, prefix: '', arg: 'key' });
    expect(parseArg('__key=', ['_']))
      .toEqual({ key: 'key', value: '', prefix: '__', arg: '__key=' });
    expect(parseArg('__', ['_']))
      .toEqual({ key: '', value: undefined, prefix: '__', arg: '__' });
    expect(parseArg('=value', ['_']))
      .toEqual({ key: '', value: 'value', prefix: '', arg: '=value' });
    expect(parseArg('__=value', ['_']))
      .toEqual({ key: '', value: 'value', prefix: '__', arg: '__=value' });
    expect(parseArg('=', ['_']))
      .toEqual({ key: '', value: '', prefix: '', arg: '=' });
  });

  test('must parse argument with several prefixes (\\$) correctly', () => {
    expect(parseArg('--key=value', ['\\', '$']))
      .toEqual({ key: '--key', value: 'value', prefix: '', arg: '--key=value' });
    expect(parseArg('--key', ['\\', '$']))
      .toEqual({ key: '--key', value: undefined, prefix: '', arg: '--key' });
    expect(parseArg('key', ['\\', '$']))
      .toEqual({ key: 'key', value: undefined, prefix: '', arg: 'key' });
    expect(parseArg('--key=', ['\\', '$']))
      .toEqual({ key: '--key', value: '', prefix: '', arg: '--key=' });
    expect(parseArg('--', ['\\', '$']))
      .toEqual({ key: '--', value: undefined, prefix: '', arg: '--' });
    expect(parseArg('=value', ['\\', '$']))
      .toEqual({ key: '', value: 'value', prefix: '', arg: '=value' });
    expect(parseArg('--=value', ['\\', '$']))
      .toEqual({ key: '--', value: 'value', prefix: '', arg: '--=value' });
    expect(parseArg('=', ['\\', '$']))
      .toEqual({ key: '', value: '', prefix: '', arg: '=' });

    expect(parseArg('\\\\key=value', ['\\', '$']))
      .toEqual({ key: 'key', value: 'value', prefix: '\\\\', arg: '\\\\key=value' });
    expect(parseArg('\\\\key', ['\\', '$']))
      .toEqual({ key: 'key', value: undefined, prefix: '\\\\', arg: '\\\\key' });
    expect(parseArg('key', ['\\', '$']))
      .toEqual({ key: 'key', value: undefined, prefix: '', arg: 'key' });
    expect(parseArg('\\\\key=', ['\\', '$']))
      .toEqual({ key: 'key', value: '', prefix: '\\\\', arg: '\\\\key=' });
    expect(parseArg('\\\\', ['\\', '$']))
      .toEqual({ key: '', value: undefined, prefix: '\\\\', arg: '\\\\' });
    expect(parseArg('=value', ['\\', '$']))
      .toEqual({ key: '', value: 'value', prefix: '', arg: '=value' });
    expect(parseArg('\\\\=value', ['\\', '$']))
      .toEqual({ key: '', value: 'value', prefix: '\\\\', arg: '\\\\=value' });
    expect(parseArg('=', ['\\', '$']))
      .toEqual({ key: '', value: '', prefix: '', arg: '=' });

    expect(parseArg('$$key=value', ['\\', '$']))
      .toEqual({ key: 'key', value: 'value', prefix: '$$', arg: '$$key=value' });
    expect(parseArg('$$key', ['\\', '$']))
      .toEqual({ key: 'key', value: undefined, prefix: '$$', arg: '$$key' });
    expect(parseArg('key', ['\\', '$']))
      .toEqual({ key: 'key', value: undefined, prefix: '', arg: 'key' });
    expect(parseArg('$$key=', ['\\', '$']))
      .toEqual({ key: 'key', value: '', prefix: '$$', arg: '$$key=' });
    expect(parseArg('$$', ['\\', '$']))
      .toEqual({ key: '', value: undefined, prefix: '$$', arg: '$$' });
    expect(parseArg('=value', ['\\', '$']))
      .toEqual({ key: '', value: 'value', prefix: '', arg: '=value' });
    expect(parseArg('$$=value', ['\\', '$']))
      .toEqual({ key: '', value: 'value', prefix: '$$', arg: '$$=value' });
    expect(parseArg('=', ['\\', '$']))
      .toEqual({ key: '', value: '', prefix: '', arg: '=' });

    expect(parseArg('\\$key=value', ['\\', '$']))
      .toEqual({ key: '$key', value: 'value', prefix: '\\', arg: '\\$key=value' });
    expect(parseArg('\\$key', ['\\', '$']))
      .toEqual({ key: '$key', value: undefined, prefix: '\\', arg: '\\$key' });
    expect(parseArg('key', ['\\', '$']))
      .toEqual({ key: 'key', value: undefined, prefix: '', arg: 'key' });
    expect(parseArg('\\$key=', ['\\', '$']))
      .toEqual({ key: '$key', value: '', prefix: '\\', arg: '\\$key=' });
    expect(parseArg('\\$', ['\\', '$']))
      .toEqual({ key: '$', value: undefined, prefix: '\\', arg: '\\$' });
    expect(parseArg('=value', ['\\', '$']))
      .toEqual({ key: '', value: 'value', prefix: '', arg: '=value' });
    expect(parseArg('\\$=value', ['\\', '$']))
      .toEqual({ key: '$', value: 'value', prefix: '\\', arg: '\\$=value' });
    expect(parseArg('=', ['\\', '$']))
      .toEqual({ key: '', value: '', prefix: '', arg: '=' });

    expect(parseArg('$\\key=value', ['\\', '$']))
      .toEqual({ key: '\\key', value: 'value', prefix: '$', arg: '$\\key=value' });
    expect(parseArg('$\\key', ['\\', '$']))
      .toEqual({ key: '\\key', value: undefined, prefix: '$', arg: '$\\key' });
    expect(parseArg('key', ['\\', '$']))
      .toEqual({ key: 'key', value: undefined, prefix: '', arg: 'key' });
    expect(parseArg('$\\key=', ['\\', '$']))
      .toEqual({ key: '\\key', value: '', prefix: '$', arg: '$\\key=' });
    expect(parseArg('$\\', ['\\', '$']))
      .toEqual({ key: '\\', value: undefined, prefix: '$', arg: '$\\' });
    expect(parseArg('=value', ['\\', '$']))
      .toEqual({ key: '', value: 'value', prefix: '', arg: '=value' });
    expect(parseArg('$\\=value', ['\\', '$']))
      .toEqual({ key: '\\', value: 'value', prefix: '$', arg: '$\\=value' });
    expect(parseArg('=', ['\\', '$']))
      .toEqual({ key: '', value: '', prefix: '', arg: '=' });
  });
});

describe('parseArgs function', () => {
  test('must parse arguments correctly by default', () => {
    expect(parseArgs(['--key1=value1', '--key2', 'key3', '--key4=', '--', '=value6', '--=value7', '=']))
      .toEqual({ key1: 'value1', key2: undefined, key4: '' });
  });

  test('must parse arguments correctly with prefix = _', () => {
    expect(parseArgs(['--key1=value1', '__key2', '_key3=', '--key4', '-key5', '=value6', '--=value7', '='], undefined, ['_']))
      .toEqual({ key2: undefined, key3: '' });
  });
});

describe('argsParser function', () => {
  test('must overwrite the identical keys to the value of last argument with the same key', () => {
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

  test('The specified keys take precedence', () => {
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

  test('Specified keys is overriding global options', () => {
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

  test('must parse arguments correctly with default parameters', () => {
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

  test('must parse arguments correctly with given global defaultValue', () => {
    expect(argsParser(
      ['--key1', '--key2='],
      { defaultValue: undefined }
    )).toEqual({
      key1: undefined, key2: ''
    });

    expect(argsParser(
      ['--key1', '--key2='],
      { defaultValue: null }
    )).toEqual({
      key1: null, key2: ''
    });

    expect(argsParser(
      ['--key1', '--key2='],
      { defaultValue: true }
    )).toEqual({
      key1: true, key2: ''
    });

    expect(argsParser(
      ['--key1', '--key2='],
      { defaultValue: false }
    )).toEqual({
      key1: false, key2: ''
    });

    expect(argsParser(
      ['--key1', '--key2='],
      { defaultValue: 0 }
    )).toEqual({
      key1: 0, key2: ''
    });

    expect(argsParser(
      ['--key1', '--key2='],
      { defaultValue: 0.5 }
    )).toEqual({
      key1: 0.5, key2: ''
    });

    expect(argsParser(
      ['--key1', '--key2='],
      { defaultValue: -0.5 }
    )).toEqual({
      key1: -0.5, key2: ''
    });

    expect(argsParser(
      ['--key1', '--key2='],
      { defaultValue: Infinity }
    )).toEqual({
      key1: Infinity, key2: ''
    });

    expect(argsParser(
      ['--key1', '--key2='],
      { defaultValue: +Infinity }
    )).toEqual({
      key1: +Infinity, key2: ''
    });

    expect(argsParser(
      ['--key1', '--key2='],
      { defaultValue: -Infinity }
    )).toEqual({
      key1: -Infinity, key2: ''
    });

    expect(argsParser(
      ['--key1', '--key2='],
      { defaultValue: NaN }
    )).toEqual({
      key1: NaN, key2: ''
    });

    expect(argsParser(
      ['--key1', '--key2='],
      { defaultValue: 'Hello World!' }
    )).toEqual({
      key1: 'Hello World!', key2: ''
    });

    expect(argsParser(
      ['--key1', '--key2='],
      { defaultValue: { name: 'alex', age: 22, married: false } }
    )).toEqual({
      key1: { name: 'alex', age: 22, married: false }, key2: ''
    });

    expect(argsParser(
      ['--key1', '--key2='],
      { defaultValue: [null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"] }
    )).toEqual({
      key1: [null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"], key2: ''
    });
  });

  test('must parse arguments correctly with given global parseValue', () => {
    expect(argsParser(
      [
        '--key1=undefined',
        '--key2=null',
        '--key3=true',
        '--key4=false',
        '--key5=0',
        '--key6=0.5',
        '--key7=-0.5',
        '--key8=Infinity',
        '--key9=+Infinity',
        '--key10=-Infinity',
        '--key11=NaN',
        '--key12=Hello World!',
        '--key13={ name: "alex", \'age\': 22, "married": false }',
        '--key14=[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]',

        '--key15=\'undefined\'',
        '--key16="null"',
        '--key17=\'true\'',
        '--key18="false"',
        '--key19=\'0\'',
        '--key20="0.5"',
        '--key21=\'-0.5\'',
        '--key22="Infinity"',
        '--key23=\'+Infinity\'',
        '--key24="-Infinity"',
        '--key25=\'NaN\'',
        '--key26="Hello World!"',
        '--key27=\'{ name: "alex", \'age\': 22, "married": false }\'',
        '--key28="[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]"'
      ],
      {
        parseValue: true
      }
    )).toEqual({
      key1: undefined,
      key2: null,
      key3: true,
      key4: false,
      key5: 0,
      key6: 0.5,
      key7: -0.5,
      key8: Infinity,
      key9: +Infinity,
      key10: -Infinity,
      key11: NaN,
      key12: 'Hello World!',
      key13: { name: 'alex', age: 22, married: false },
      key14: [null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, 'Hello World!'],

      key15: 'undefined',
      key16: 'null',
      key17: 'true',
      key18: 'false',
      key19: '0',
      key20: '0.5',
      key21: '-0.5',
      key22: 'Infinity',
      key23: '+Infinity',
      key24: '-Infinity',
      key25: 'NaN',
      key26: 'Hello World!',
      key27: '{ name: "alex", \'age\': 22, "married": false }',
      key28: '[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]'
    });

    expect(argsParser(
      [
        '--key1=undefined',
        '--key2=null',
        '--key3=true',
        '--key4=false',
        '--key5=0',
        '--key6=0.5',
        '--key7=-0.5',
        '--key8=Infinity',
        '--key9=+Infinity',
        '--key10=-Infinity',
        '--key11=NaN',
        '--key12=Hello World!',
        '--key13={ name: "alex", \'age\': 22, "married": false }',
        '--key14=[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]',

        '--key15=\'undefined\'',
        '--key16="null"',
        '--key17=\'true\'',
        '--key18="false"',
        '--key19=\'0\'',
        '--key20="0.5"',
        '--key21=\'-0.5\'',
        '--key22="Infinity"',
        '--key23=\'+Infinity\'',
        '--key24="-Infinity"',
        '--key25=\'NaN\'',
        '--key26="Hello World!"',
        '--key27=\'{ name: "alex", \'age\': 22, "married": false }\'',
        '--key28="[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]"'
      ],
      {
        parseValue: false
      }
    )).toEqual({
      key1: 'undefined',
      key2: 'null',
      key3: 'true',
      key4: 'false',
      key5: '0',
      key6: '0.5',
      key7: '-0.5',
      key8: 'Infinity',
      key9: '+Infinity',
      key10: '-Infinity',
      key11: 'NaN',
      key12: 'Hello World!',
      key13: '{ name: "alex", \'age\': 22, "married": false }',
      key14: '[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]',

      key15: '\'undefined\'',
      key16: '"null"',
      key17: '\'true\'',
      key18: '"false"',
      key19: '\'0\'',
      key20: '"0.5"',
      key21: '\'-0.5\'',
      key22: '"Infinity"',
      key23: '\'+Infinity\'',
      key24: '"-Infinity"',
      key25: '\'NaN\'',
      key26: '"Hello World!"',
      key27: '\'{ name: "alex", \'age\': 22, "married": false }\'',
      key28: '"[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]"'
    });
  });

  test('must parse arguments correctly with given global prefix', () => {
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

  test('must parse arguments correctly with aliases', () => {
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

  test('must parse arguments correctly with aliases and overriding options', () => {
    const keysWithAlias1 = {
      foo: {
        aliases: ['f', 'fo'],
        defaultValue: 5
      }
    };

    expect(argsParser( ['--foo'], {}, keysWithAlias1 )).toEqual({ foo: 5 });
    expect(argsParser( ['-f'], {}, keysWithAlias1 )).toEqual({ foo: 5 });
    expect(argsParser( ['-fo'], {}, keysWithAlias1 )).toEqual({ foo: 5 });

    const keysWithAlias2 = {
      foo: {
        aliases: ['f', 'fo'],
        defaultValue: 5,
        prefix: '-'
      }
    };

    expect(argsParser( ['--foo'], { prefix: '' }, keysWithAlias2 )).toEqual({ foo: 5 });
    expect(argsParser( ['-f'], { prefix: '' }, keysWithAlias2 )).toEqual({ foo: 5 });
    expect(argsParser( ['-fo'], { prefix: '' }, keysWithAlias2 )).toEqual({ foo: 5 });

    const keysWithAlias3 = {
      '--foo': {
        aliases: ['-f', '-fo'],
        defaultValue: 5
      }
    };

    expect(argsParser( ['--foo'], { prefix: '' }, keysWithAlias3 )).toEqual({ '--foo': 5 });
    expect(argsParser( ['-f'], { prefix: '' }, keysWithAlias3 )).toEqual({ '--foo': 5 });
    expect(argsParser( ['-fo'], { prefix: '' }, keysWithAlias3 )).toEqual({ '--foo': 5 });

    const keysWithAlias4 = {
      '--foo': {
        aliases: ['+f', '+fo'],
        defaultValue: 5
      }
    };

    expect(argsParser( ['--foo'], { prefix: '' }, keysWithAlias4 )).toEqual({ '--foo': 5 });
    expect(argsParser( ['+f'], { prefix: '' }, keysWithAlias4 )).toEqual({ '--foo': 5 });
    expect(argsParser( ['+fo'], { prefix: '' }, keysWithAlias4 )).toEqual({ '--foo': 5 });
  });

  test('must parse arguments correctly with keys', () => {
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

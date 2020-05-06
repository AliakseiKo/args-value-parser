/* eslint-env jest */
const { argsParser, parseArgs, parseArg, parseValue } = require('../src/parser');

describe('parseValue function', () => {
  test('must parse null', () => {
    expect(parseValue('null')).toEqual(null);
  });

  test('must parse boolean', () => {
    expect(parseValue('true')).toEqual(true);
    expect(parseValue('false')).toEqual(false);
  });

  test('must parse number', () => {
    expect(parseValue('0')).toEqual(0);
    expect(parseValue('0.5')).toEqual(0.5);
    expect(parseValue('-0.5')).toEqual(-0.5);
    expect(parseValue('Infinity')).toEqual(Infinity);
    expect(parseValue('+Infinity')).toEqual(+Infinity);
    expect(parseValue('-Infinity')).toEqual(-Infinity);
    expect(parseValue('NaN')).toEqual(NaN);
  });

  test('must parse string', () => {
    expect(parseValue('"null"')).toEqual('null');
    expect(parseValue('"true"')).toEqual('true');
    expect(parseValue('"false"')).toEqual('false');
    expect(parseValue('"0"')).toEqual('0');
    expect(parseValue('"0.5"')).toEqual('0.5');
    expect(parseValue('"-0.5"')).toEqual('-0.5');
    expect(parseValue('"Infinity"')).toEqual('Infinity');
    expect(parseValue('"+Infinity"')).toEqual('+Infinity');
    expect(parseValue('"-Infinity"')).toEqual('-Infinity');
    expect(parseValue('"NaN"')).toEqual('NaN');
    expect(parseValue('"[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]"'))
      .toEqual('[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]');

    expect(parseValue('Hello World!')).toEqual('Hello World!');
    expect(parseValue('"Hello World!"')).toEqual('Hello World!');
    expect(parseValue('\'Hello World!\'')).toEqual('Hello World!');
  });

  test('must parse array', () => {
    expect(parseValue('[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]'))
      .toEqual([null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, 'Hello World!']);
  });

  test('must parse object', () => {
    expect(parseValue('{ name: "alex", \'age\': 22, "married": false }'))
      .toEqual({ name: "alex", age: 22, married: false });
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
  test('must parse arguments correctly with default parameters', () => {
    expect(argsParser([
      '--key1',
      '--key2='
    ])).toEqual({
      key1: true,
      key2: ''
    });

    // rewrite the same keys
    expect(argsParser([
      '--key1=5',
      '--key1=10'
    ])).toEqual({
      key1: 10
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

  test('must parse arguments correctly with given defaultValue', () => {
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

  test('must parse arguments correctly with given valueToJS', () => {
    expect(argsParser(
      [
        '--key1=null',
        '--key2=true',
        '--key3=false',
        '--key4=0',
        '--key5=0.5',
        '--key6=-0.5',
        '--key7=Infinity',
        '--key8=+Infinity',
        '--key9=-Infinity',
        '--key10=NaN',
        '--key11=Hello World!',
        '--key12={ name: "alex", \'age\': 22, "married": false }',
        '--key13=[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]',

        '--key14="null"',
        '--key15=\'true\'',
        '--key16="false"',
        '--key17=\'0\'',
        '--key18="0.5"',
        '--key19=\'-0.5\'',
        '--key20="Infinity"',
        '--key21=\'+Infinity\'',
        '--key22="-Infinity"',
        '--key23=\'NaN\'',
        '--key24="Hello World!"',
        '--key25=\'{ name: "alex", \'age\': 22, "married": false }\'',
        '--key26="[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]"'
      ],
      {
        valueToJS: true
      }
    )).toEqual({
      key1: null,
      key2: true,
      key3: false,
      key4: 0,
      key5: 0.5,
      key6: -0.5,
      key7: Infinity,
      key8: +Infinity,
      key9: -Infinity,
      key10: NaN,
      key11: 'Hello World!',
      key12: { name: 'alex', age: 22, married: false },
      key13: [null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, 'Hello World!'],

      key14: 'null',
      key15: 'true',
      key16: 'false',
      key17: '0',
      key18: '0.5',
      key19: '-0.5',
      key20: 'Infinity',
      key21: '+Infinity',
      key22: '-Infinity',
      key23: 'NaN',
      key24: 'Hello World!',
      key25: '{ name: "alex", \'age\': 22, "married": false }',
      key26: '[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]'
    });

    expect(argsParser(
      [
        '--key1=null',
        '--key2=true',
        '--key3=false',
        '--key4=0',
        '--key5=0.5',
        '--key6=-0.5',
        '--key7=Infinity',
        '--key8=+Infinity',
        '--key9=-Infinity',
        '--key10=NaN',
        '--key11=Hello World!',
        '--key12={ name: "alex", \'age\': 22, "married": false }',
        '--key13=[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]',

        '--key14="null"',
        '--key15=\'true\'',
        '--key16="false"',
        '--key17=\'0\'',
        '--key18="0.5"',
        '--key19=\'-0.5\'',
        '--key20="Infinity"',
        '--key21=\'+Infinity\'',
        '--key22="-Infinity"',
        '--key23=\'NaN\'',
        '--key24="Hello World!"',
        '--key25=\'{ name: "alex", \'age\': 22, "married": false }\'',
        '--key26="[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]"'
      ],
      {
        valueToJS: false
      }
    )).toEqual({
      key1: 'null',
      key2: 'true',
      key3: 'false',
      key4: '0',
      key5: '0.5',
      key6: '-0.5',
      key7: 'Infinity',
      key8: '+Infinity',
      key9: '-Infinity',
      key10: 'NaN',
      key11: 'Hello World!',
      key12: '{ name: "alex", \'age\': 22, "married": false }',
      key13: '[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]',

      key14: '"null"',
      key15: '\'true\'',
      key16: '"false"',
      key17: '\'0\'',
      key18: '"0.5"',
      key19: '\'-0.5\'',
      key20: '"Infinity"',
      key21: '\'+Infinity\'',
      key22: '"-Infinity"',
      key23: '\'NaN\'',
      key24: '"Hello World!"',
      key25: '\'{ name: "alex", \'age\': 22, "married": false }\'',
      key26: '"[null, true, false, 0, 0.5, -0.5, Infinity, +Infinity, -Infinity, NaN, "Hello World!"]"'
    });
  });

  test('must parse arguments correctly with given prefix', () => {
    expect(argsParser(
      [
        'key1=5',
        '+key2=10',
        '++key3=15',
        '+++key4=20',
        '-key5=25',
        '--key6=30',
        '---key7=35',
      ],
      {
        prefix: '+'
      }
    )).toEqual({
      key3: 15
    });
  });

  test('must parse arguments correctly with keys', () => {
    // overriding global options
    expect(argsParser(
      [
        '--key1',
        '--key2',
        '--key3=null',
        '--key4=false',
        '__key4=[1, 2, 3]'
      ],
      {
        defaultValue: true,
        valueToJS: true,
        prefix: '-'
      },
      {
        key2: {
          defaultValue: 10
        },
        key3: {
          valueToJS: false
        },
        key4: {
          prefix: '_'
        }
      }
    )).toEqual({
      key1: true,
      key2: 10,
      key3: 'null',
      key4: [1, 2, 3],
      '--key4': false  // because key4 was reserved with prefix = '_'
    });

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

    // aliases
    // expect(argsParser(
    //   ['--key1', '--key2', '--key3=null', '--key4=false', '__key4=[1, 2, 3]', 'somekey=Hello World!'],
    //   {
    //     prefix: ''
    //   },
    //   {
    //     key1: {
    //       defaultValue: 10,
    //       prefix: '-'
    //     }
    //   }
    // )).toEqual({
    //   key1: 10,
    //   '--key2': true,
    //   '--key3': null,
    //   '--key4': false,
    //   '__key4': [1, 2, 3],
    //   somekey: 'Hello World!',
    // });
  });
});

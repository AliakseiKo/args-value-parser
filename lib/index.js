const parser = require('./parser');
const { escape } = require('./utils');

/**
 * Parses input value to JS data type or structure, if it is possible.
 * If you wrap the string in extra quotation marks, the value will not be parsed, and additional
 * quotation marks will be deleted.
 * @param {*} value - it's a string usually
 * @returns {*} - a JS data type or structure if the parsing was successful,
 * otherwise the input value.
 * @example
 * parseValue('"[1, 2, 3]"');
 *   returns '[1, 2, 3]';
 * parseValue('["0.5", -Infinity, null, 0o377, { name: "alex", age: 22 }]');
 *   returns ['0.5', -Infinity, null, 255, { name: 'alex', age: 22 }];
 */
function parseValue(value) {
  try {
    return parser(value);
  } catch (e) {
    if (typeof value === 'string') return value.replace(/^(['"`])(.*)\1$/s, '$2');
    return value;
  }
}

/**
 * The object which parseArg function returns
 * @typedef {Object} parseResult
 * @property {string} key - key that was parsed. For example: '--foo=25' = 'foo'
 * @property {(string|undefined)} value - value that was parsed. For example: '--foo=25' = '25'
 * @property {string} prefix - prefix that was parsed. For example: '--foo=25' = '--'
 * @property {string} arg - source argument. For example: '--foo=25'
 */

/**
 * Parses a string into a prefix, key, value
 * @param {string} arg - an input string;
 * @param {Array.<string>} [prefixes=['-']] - array of strings which can be prefixes.
 * @returns {parseResult} - the object that contains the following
 * properties: { prefix, key, value, arg }.
 * @example
 * parseArg('--foo=25', ['-']); // prefixes = ['-'] by default.
 *   returns { prefix: '--', key: 'foo', value: '25', arg: '--foo=25' };
 */
function parseArg(arg, prefixes = ['-']) {
  const _prefixes = escape(prefixes.join(''), escape.regExp, false);
  const regExp = new RegExp(
    `^(?<prefix>([${_prefixes}])\\2*)?(?<key>[^=]*)?(?<sign>=)?(?<value>.*)?$`, 's'
  );
  let { prefix = '', key = '', value, sign } = (arg.match(regExp) || { groups: {} }).groups;
  if (sign) value = value || '';
  return { prefix, key, value, arg };
}

/**
 * The result object which parseCallback function may return.
 * @typedef {Object} parseCallbackResult
 * @property {string} key - key that was parsed. For example: '--foo=25' = 'foo'.
 * @property {*} value - value that was parsed. For example: '--foo=25' = '25'.
 */

/**
 * This callback will be called on each of arguments. Works like Array.prototype.map callback
 * @callback parseCallback
 * @param {string} key - key that was parsed. For example: '--foo=25' = 'foo'.
 * @param {(string|undefined)} value - value that was parsed. For example: '--foo=25' = '25'.
 * @param {string} prefix - prefix that was parsed. For example: '--foo=25' = '--'.
 * @param {string} arg - source argument. For example: '--foo=25'.
 * @returns {(parseCallbackResult|*)}
 */

/**
 * Creates an object from the results of the callback call. Works like Array.prototype.map.
 * @param {Array.<string>} [args=process.argv] - array of arguments.
 * @param {parseCallback} [callback=(key, value) => ({ key, value })] - a function that
 * will be called for each of the array arguments with the following arguments:
 * (key, value, prefix, arg), and the results of its calls will be written to the resulting object.
 * If function returns object which contains key and value properties then result of its call
 * will be written to the resulting object else result will not be written.
 * @param {Array.<string>} [prefixes=['-']] - array of strings which can be prefixes.
 * @returns {Object.<string, *>} result object with the following structure: { <key>: <value> }.
 * @example
 * parseArgs(['--foo=25', '-bar', '_qux='], (key, value) => {
 *   if (key === 'foo') return { key: 'f', value: value + 5 };
 *   return { key, value };
 * }); // callback and prefixes set default.
 *
 * returns { f: 30, bar: undefined, '_qux': '' };
 */
function parseArgs(
  args = process.argv.slice(2),
  callback = (key, value, prefix) => {
    if (prefix && key) return { key, value };
  },
  prefixes = ['-']
) {
  const resultDict = {};
  args.forEach((arg) => {
    const parsedR = parseArg(arg, prefixes);
    const callbackR = callback(parsedR.key, parsedR.value, parsedR.prefix, arg);
    if (typeof callbackR === 'object' && 'key' in callbackR && 'value' in callbackR) {
      resultDict[callbackR.key] = callbackR.value;
    }
  });
  return resultDict;
}

/**
 * The option object of argsParser function
 * @typedef {Object} Options
 * @property {*} [defaultValue=true] - a default value. used if argument value will not passed.
 * For example if we passed '--foo' without any value then value of foo would be equal defaultValue.
 * @property {boolean} [parseValue=true] - parse string value to JS data type or structure.
 * For example if we set this property to false then value of passed argument, for example like
 * this '--foo=true' will not be boolean, it will be string 'true'.
 * @property {string} [prefix='-'] - prefix of argument. For example,
 * in the following string '--foo=25' prefix would be '-'.
 */

/**
 * The object describing key's own options. Overrides global options for only specified key
 * @typedef {Object} KeyDescription
 * @property {Array.<string>} [aliases] - an array that contains aliases.
 * @property {*} [defaultValue] - a default value. Overrides options.defaultValue.
 * @property {boolean} [parseValue] - parse string value to JS data type or structure.
 * Overrides options.parseValue.
 * @property {string} [prefix] - prefix of argument. For example, in the following
 * string '--foo=25' prefix would be '-'. Overrides options.parseValue.
 */

/**
 * Parses each argument from array of arguments.
 * @param {Array.<string>} [args=process.argv] - array of arguments.
 * @param {Options} [options=Options] - the options object, sets global options
 * for all arguments (keys).
 * @param {Object.<string, KeyDescription>} [keys={}] - the dictionary object with the following
 * structure: { <key>: <keyDescriptor> }.
 * @returns {Object.<string, *>} - result object with the following structure: { <key>: <value> }.
 * @example
 * const args = ['--foo=25', '__bar', '-Q'];
 * const options = { defaultValue: 500, prefix: '_' };
 * const keys = {
 *   qux: { aliases: ['Q'], defaultValue: true, prefix: '-' }
 * };
 *
 * argsParser(args, options, keys);
 *   returns { bar: 500, qux: true };
 */
function argsParser(args = process.argv.slice(2), options = {}, keys = {}) {
  const defaultOptions = { defaultValue: true, parseValue: true, prefix: '-' };
  const _options = Object.create(defaultOptions, Object.getOwnPropertyDescriptors(options));
  const _keys = {};
  const prefixSet = new Set();
  const aliasDict = {};

  _options.prefix = _options.prefix.charAt(0);
  prefixSet.add(_options.prefix);

  Object.keys(keys).forEach((key) => {
    if (Object.prototype.toString.call(keys[key]) === '[object Object]') {
      _keys[key] = Object.create(_options, Object.getOwnPropertyDescriptors(keys[key]));
    }

    _keys[key].prefix = _keys[key].prefix.charAt(0);
    prefixSet.add(_keys[key].prefix);

    aliasDict[_keys[key].prefix.repeat(2) + key] = key;

    if (Array.isArray(_keys[key].aliases)) {
      _keys[key].aliases.forEach((alias) => {
        aliasDict[_keys[key].prefix + alias] = key;
      });
    }
  });

  const _prefixes = Array.from(prefixSet.values());

  return parseArgs(args, (key, value, prefix) => {
    if (key === '') return;
    const __key = prefix + key;
    let known = false;

    if (aliasDict[__key]) {
      known = true;
      key = aliasDict[__key];
    } else if (_options.prefix === '') {
      key = __key;
    } else if (prefix.charAt(0) === _options.prefix && prefix.length === 2) {
      if (_keys[key]) key = __key;
    } else return;

    value = (value === undefined)
      ? (known ? _keys[key].defaultValue : _options.defaultValue)
      : (known ? _keys[key].parseValue : _options.parseValue)
        ? parseValue(value)
        : value;

    return { key, value };
  }, _prefixes);
}

module.exports = { argsParser, parseArgs, parseArg, parseValue };

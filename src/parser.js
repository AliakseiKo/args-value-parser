const JSON5 = require('json5');
const { escape } = require('./utils');

/**
 * Parses input value to JS data type or structure, if it is possible
 * @param {*} value
 * @returns {*} - return a JS data type or structure if the parsing was successful, otherwise the input value.
 */
function parseValue(value) {
  try {
    return JSON5.parse(value);
  } catch (e) {
    if (typeof value === 'string') return value.replace(/^(['"`])(.*)\1$/s, '$2');
    return value;
  }
}

/**
 * The object which parseArg function returns
 * @typedef {Object} parseResult
 * @property {string} key - key that was parsed from '--key=value' = 'key'
 * @property {(string|undefined)} value - value that was parsed from '--key=value' 'value'
 * @property {string} prefix - prefix that was parsed from '--key=value' = '--'
 * @property {string} arg - source argument '--key=value'
 */

/**
 * Parse argument like --key=value and returns object { key, value, prefix, arg }
 * @param {string} arg - examples: '--key=value', 'key=value', 'key', 'abc', '123', etc
 * @param {string[]} [prefix=['-']] - prefixes of argument
 * @returns {parseResult} - object constists key, value, prefix, arg.
 */
function parseArg(arg, prefixes = ['-']) {
  const _prefixes = escape(prefixes.join(''), escape.regExp, false);
  const regExp = new RegExp(
    `^(?<prefix>([${_prefixes}])\\2*)?(?<key>[^=]*)?(?<sign>=)?(?<value>.*)?$`, 's'
  );
  let { prefix = '', key = '', value, sign } = (arg.match(regExp) || { groups: {} }).groups;
  if (sign) value = value || '';
  return { key, value, prefix, arg };
}

/**
 * The result object which parseCallback function may return
 * @typedef {Object} parseCallbackResult
 * @property {string} key - key that was parsed from --key=value
 * @property {*} value - value that was parsed from --key=value
 */

/**
 * This callback will be called on each of arguments. Works like Array.prototype.map callback
 * @callback parseCallback
 * @param {string} key
 * @param {(string|undefined)} value
 * @param {string} prefix
 * @param {string} arg
 * @returns {(parseCallbackResult|undefined)}
 */

/**
 * Creates an object from the results of a callback call. Directly like Array.prototype.map.
 * @param {string[]} [args=process.argv] - array of arguments
 * @param {parseCallback} [callback=(key, value, prefix, arg) => ({ key, value })] -
 * will be called for each of arguments array with the following arguments: (key, value, prefix,
 * arg), and writes the result of its call to a new object that will be returned by this function
 * @param {string} [options.prefix="-"] - prefix of argument --key=value [--] - prefix
 * @returns {Object.<string, *>} result object that contains parsed arguments { keys: values }
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
 * @property {*} [defaultValue=true] - default value. use if argument value will not passed.
 * @property {boolean} [valueToJS=true] - parse string value to JS data type or structure.
 * @property {string} [prefix=''] - prefix of argument '--key=value' [--] - prefix
 */

/**
 * The object describing key's own optins. Overrides global options for only this key
 * @typedef {Object} KeyDescription
 * @property {string[]} [aliases] - an array that contains aliases.
 * @property {*} [defaultValue] - default value. Overrides option.defaultValue
 * @property {boolean} [valueToJS] - parse string value to JS data type or structure. Overrides option.valueToJS
 * @property {string} [prefix] - prefix of argument '--key=value' [--] - prefix. Overrides option.valueToJS
 */

/**
 * This function parses each argument from array of arguments and return object that consist { key: value }.
 * @param {string[]} [args=process.argv] - array of arguments.
 * @param {Options} [options] - option object.
 * @param {Object.<string, KeyDescription>} [keys] - object must contain { keys: keyDescriptors }.
 * @returns {Object.<string, *>} result object that contains parsed arguments { keys: values }.
 */
function argsParser(args = process.argv.slice(2), options = {}, keys = {}) {
  const defaultOptions = { defaultValue: true, valueToJS: true, prefix: '-' };
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
      : (known ? _keys[key].valueToJS : _options.valueToJS)
        ? parseValue(value)
        : value;

    return { key, value };
  }, _prefixes);
}

module.exports = { argsParser, parseArgs, parseArg, parseValue };

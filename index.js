const { escape } = require("./Utils");

/**
 * Object which parseArg function returns
 * @typedef {Object} valueParseResult
 * @property {boolean} successful
 * @property {*} value
 */

/**
 * Returns valueParseResult with successful property equal true and value property equal input value
 * @param {*} value
 * @returns {valueParseResult}
 */
function success(value) {
  return { successful: true, value };
}

/**
 * Returns valueParseResult with successful property equal false and value property equal input value
 * @param {*} value
 * @returns {valueParseResult}
 */
function fail(value) {
  return  { successful: false, value };
}

/**
 * Parse input value to undefined data type if it is possible
 * @param {*} value
 * @returns {valueParseResult} - if parsing was successful .value will be undefined else input value.
 */
function parseUndefined(value) {
  if (typeof value === "undefined") return success(value);
  if (value === "undefined") return success(undefined);
  return fail(value);
}

/**
 * Parse input value to null if it is possible
 * @param {*} value
 * @returns {valueParseResult} - if parsing was successful .value will be null else input value.
 */
function parseNull(value) {
  if (value === null) return success(null);
  if (value === "null") return success(null);
  return fail(value);
}

/**
 * Parse input value to boolean data type if it is possible
 * @param {*} value
 * @returns {valueParseResult} - if parsing was successful .value will be boolean else input value.
 */
function parseBoolean(value) {
  if (typeof value === "boolean") return  success(value);
  if (value === "true") return success(true);
  if (value === "false") return success(false);
  return fail(value);
}

/**
 * Parse input value to number data type if it is possible
 * @param {*} value
 * @returns {valueParseResult} - if parsing was successful .value will be number else input value.
 */
function parseNumber(value) {
  if (value === "") return fail(value);
  if (value === "NaN") return success(NaN);
  if (value === "Infinity") return success(Infinity);
  if (value === "-Infinity") return success(-Infinity);
  const number = Number(value);
  if (!isNaN(number)) return success(number);
  return fail(value);
}

/**
 * Parse input value to array data structure if it is possible
 * @param {*} value
 * @returns {valueParseResult} - if parsing was successful .value will be array else input value.
 */
function parseArray(value) {
  if (Array.isArray(value)) return success(value);
  if (typeof value === "string" && /^\[.*\]$/s.test(value)) {
    try { return success( eval(`(function(){return${value}})()`) ); }
    catch { return fail(value); }
  }
  return fail(value);
}

/**
 * Parse input value to object data type if it is possible
 * @param {*} value
 * @returns {valueParseResult} - if parsing was successful .value will be object else input value.
 */
function parseObject(value) {
  if (!Array.isArray(value) && typeof value === "object") return success(value);
  if (typeof value === "string" && /^\{.*\}$/s.test(value)) {
    try { return success( eval(`(function(){return${value}})()`) ); }
    catch { return fail(value); }
  }
  return fail(value);
}

/**
 * Parse input value to string data type if it is possible
 * @param {*} value
 * @returns {*} - if parsing was successful .value will be string else input value.
 */
function parseString(value) {
  if (typeof value === "string") return success( value.replace(/^(['"`])(.*)\1$/s, "$2") );
  if (typeof value === "object") return success( JSON.stringify(value) );
  return success( value.toString() );
}

/**
 * Parses input value to JS data type or structure, if it is possible
 * @param {*} value
 * @returns {*} - if parsing was successful will be JS data type or structure else input value.
 */
function parseValue(value) {
  let result;
  (result = parseUndefined(value)).successful
  || (result = parseNull(value)).successful
  || (result = parseBoolean(value)).successful
  || (result = parseNumber(value)).successful
  || (result = parseArray(value)).successful
  || (result = parseObject(value)).successful
  || (result = parseString(value)).successful;
  return result.value;
}

/**
 * Object which parseArg function returns
 * @typedef {Object} parseResult
 * @property {string} key - key that was parsed from "--key=value" = "key"
 * @property {(string|undefined)} value - value that was parsed from "--key=value" "value"
 * @property {string} prefix - prefix that was parsed from "--key=value" = "--"
 * @property {string} arg - source argument "--key=value"
 */

/**
 * Parse argument like --key=value and returns object { key, value, prefix, arg }
 * @param {string} arg - examples: "--key=value", "key=value", "key", "abc", "123", etc
 * @param {string} [prefix="-"] - prefix of argument
 * @returns {parseResult} - object constists key, value, prefix, arg.
 */
function parseArg(arg, prefix = "-") {
  prefix = escape(prefix, escape.regExp);
  const regExp = new RegExp(`^([${prefix}]*)([^=]*)(=)?(.*)?$`, "s");
  const result = arg.match(regExp) || [];
  if (result[3] !== undefined) result[4] = result[4] || "";
  return { key: result[2], value: result[4], prefix: result[1], arg };
}

/**
 * Result object which parseCallback function can return
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
  callback = (key, value, prefix, arg) => ({ key, value }),
  prefix = "-"
) {
  const resultDict = {};
  args.forEach(arg => {
    const parsedR = parseArg(arg, prefix);
    const callbackR = callback(parsedR.key, parsedR.value, parsedR.prefix, arg);
    if (typeof callbackR === "object") resultDict[callbackR.key] = callbackR.value;
  });
  return resultDict;
}

/**
 * Option object of argsParser function
 * @typedef {Object} Options
 * @property {*} [defaultValue=true] - default value. use if argument value will not passed.
 * @property {boolean} [valueToJS=true] - parse string value to JS data type or structure.
 * @property {string} [prefix=""] - prefix of argument --key=value [--] - prefix
 */

/**
 * Describes key's own optins which Overrides global options for only this key
 * @typedef {Object} KeyDescription
 * @property {string[]} [aliases] - an array that contains aliases.
 * @property {*} [defaultValue] - default value. Overrides option.defaultValue
 * @property {boolean} [valueToJS] - parse string value to JS data type or structure. Overrides option.valueToJS
 * @property {string} [prefix] - prefix of argument --key=value [--] - prefix. Overrides option.valueToJS
 */

/**
 * This function parses each argument from array of arguments and return object that consist { key: value }.
 * @param {string[]} [args=process.argv] - array of arguments.
 * @param {Options} [options] - option object.
 * @param {Object.<string, KeyDescription>} [keys] - object must contain { keys: keyDescriptors }.
 * @returns {Object.<string, *>} result object that contains parsed arguments { keys: values }.
 */
function argsParser(args = process.argv.slice(2), options = {}, keys = {}) {
  defaultOptions = { defaultValue: true, valueToJS: true, prefix: "-" };
  const _options = Object.create(defaultOptions, Object.getOwnPropertyDescriptors(options) );
  const _keys = {};
  const prefixSet = new Set();
  const aliasDict = {};

  _options.prefix = _options.prefix.charAt(0);
  prefixSet.add(_options.prefix);

  // init keys and aliasDict
  for (const key in keys) {
    if (Object.prototype.toString.call(keys[key]) === "[object Object]")
      _keys[key] = Object.create( _options, Object.getOwnPropertyDescriptors(keys[key]) );

    _keys[key].prefix = _keys[key].prefix.charAt(0);
    prefixSet.add(_keys[key].prefix);

    aliasDict[_keys[key].prefix.repeat(2) + key] = key;

    if (Array.isArray(_keys[key].aliases))
      _keys[key].aliases.forEach(alias => aliasDict[_keys[key].prefix + alias] = key);
  }

  const _prefixStr = Array.from( prefixSet.values() ).join("")

  return parseArgs(args, (key, value, prefix) => {
    if (key === "") return;
    const __key = prefix + key;
    let known = false;

    if (aliasDict[__key]) {
      known = true;
      key = aliasDict[__key];
    } else if (_options.prefix === "") {
      key = __key;
    } else if (prefix.charAt(0) === _options.prefix && prefix.length < 3) {
      if (_keys[key]) key = __key;
    } else return;

    value = (known ? _keys[key].valueToJS : _options.valueToJS)
      ? (value === undefined)
        ? parseValue((known ? _keys[key].defaultValue : _options.defaultValue))
        : parseValue(value)
      : (value === undefined)
        ? parseString(known ? _keys[key].defaultValue : _options.defaultValue).value
        : value;

    return { key, value };
  }, _prefixStr);
}

module.exports = argsParser;

escape.regExp = ["^", "$", ".", "*", "+", "?", "(", ")", "[", "]", "{", "}", "|"];
function escape(str, chars = [], safety = true) {
  const regExpChars = "\\" + escape.regExp.join("\\") + "\\\\";
  _chars = (chars.join()).replace( new RegExp(`([${regExpChars}])`, "g"), "\\$&" );
  const regExp = (safety) ? `(?<!\\\\)[${_chars}]|\\\\(?![${_chars}]|\\\\)` : `[${_chars}]|\\\\`;
  return str.replace( new RegExp(regExp, "g"), "\\$&");
}

function success(value) {
  return { succeed: true, value };
}

function fail(value) {
  return  { succeed: false, value };
}

function parseUndefined(value) {
  if (typeof value === "undefined") return success(value);
  if (value === "undefined") return success(undefined);
  return fail(value);
}

function parseNull(value) {
  if (value === null) return success(null);
  if (value === "null") return success(null);
  return fail(value);
}

function parseBoolean(value) {
  if (typeof value === "boolean") return  success(value);
  if (value === "true") return success(true);
  if (value === "false") return success(false);
  return fail(value);
}

function parseNumber(value) {
  if (value === "") return fail(value);
  if (value === "NaN") return success(NaN);
  if (value === "Infinity") return success(Infinity);
  if (value === "-Infinity") return success(-Infinity);
  const number = Number(value);
  if (!isNaN(number)) return success(number);
  return fail(value);
}

function parseArray(value) {
  if (Array.isArray(value)) return success(value);
  if (typeof value === "string" && /^\[.*\]$/s.test(value)) {
    try { return success( eval(`(function(){return${value}})()`) ); }
    catch { return fail(value); }
  }
  return fail(value);
}

function parseObject(value) {
  if (!Array.isArray(value) && typeof value === "object") return success(value);
  if (typeof value === "string" && /^\{.*\}$/s.test(value)) {
    try { return success( eval(`(function(){return${value}})()`) ); }
    catch { return fail(value); }
  }
  return fail(value);
}

function parseString(value) {
  if (typeof value === "string") return success( value.replace(/^(['"`])(.*)\1$/s, "$2") );
  if (typeof value === "object") return success( JSON.stringify(value) );
  return success( value.toString() );
}

function parseValue(value) {
  let result;
  (result = parseUndefined(value)).succeed
  || (result = parseNull(value)).succeed
  || (result = parseBoolean(value)).succeed
  || (result = parseNumber(value)).succeed
  || (result = parseArray(value)).succeed
  || (result = parseObject(value)).succeed
  || (result = parseString(value)).succeed;
  return result.value;
}

function parseArg(arg, prefix = "-") {
  const regExp = new RegExp(`^([${prefix}]*)([^=]*)(=)?(.*)?$`, "s");
  const result = arg.match(regExp) || [];
  if (result[3] !== undefined) result[4] = result[4] || "";
  return { key: result[2], value: result[4], prefix: result[1], arg };
}

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

  const _prefixStr = escape( Array.from( prefixSet.values() ).join(""), escape.regExp );

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

    value = (value === undefined)
      ? (known ? _keys[key].defaultValue : _options.defaultValue)
      : (known ? _keys[key].valueToJS : _options.valueToJS)
        ? parseValue(value)
        : value;

    return { key, value };
  }, _prefixStr);
}

module.exports = argsParser;

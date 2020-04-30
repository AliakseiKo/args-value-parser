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
  if (value === "NaN") return success(NaN);
  if (value === "Infinity") return success(Infinity);
  if (value === "-Infinity") return success(-Infinity);
  const number = Number(value);
  if (!isNaN(number)) return success(number);
  return fail(value);
}

function parseArray(value) {
  if (Array.isArray(value)) return success(value);
  if (
    typeof value === "string" &&
    value.charAt(0) === "[" &&
    value.charAt(value.length - 1) === "]"
  ) {
    try { return success( eval(`(function(){return${value}})()`) ); }
    catch { return fail(value); }
  }
  return fail(value);
}

function parseObject(value) {
  if (Array.isArray(value) || typeof value === "object") return success(value);
  if (
    typeof value === "string" &&
    value.charAt(0) === "{" &&
    value.charAt(value.length - 1) === "}"
  ) {
    try { return success( eval(`(function(){return${value}})()`) ); }
    catch { return fail(value); }
  }
  return fail(value);
}

function parseString(value) {
  if (typeof value === "string") return success(value);
  if (typeof value === "object") return success( JSON.stringify(value) );
  return success( value.toString() );
}

function parseValue(value) {
  let result;
  (result = parseUndefined(value)).succeed ||
  (result = parseNull(value)).succeed ||
  (result = parseBoolean(value)).succeed ||
  (result = parseNumber(value)).succeed ||
  (result = parseArray(value)).succeed ||
  (result = parseObject(value)).succeed ||
  (result = parseString(value)).succeed;
  return result.value;
}

function parseArgs(args = process.argv.slice(2)) {

  const resultDict = {};

  args.forEach(arg => {
    if (arg.charAt(0) === "-") {
      const equalSign = arg.indexOf("=");
      const isNoValue = (equalSign === - 1);

      const __key = (isNoValue) ? arg : arg.slice(0, equalSign);

      const value = arg.slice(equalSign + 1);
      const key = __key.slice(arg.charAt(1) === "-" ? 2 : 1);

      resultDict[key] = (isNoValue) ? true : parseValue(value);
    }
  });

  return resultDict;
}

module.exports = parseArgs;

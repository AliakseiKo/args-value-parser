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
  if (Array.isArray(value) || typeof value === "object") return success(value);
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
  const regExp = new RegExp(`^(${prefix}*)?([^=]*)?(=)?(.*)?$`, "s");
  const result = arg.match(regExp) || [];
  if (result[3] !== undefined) result[4] = result[4] || "";
  return { prefix: result[1], key: result[2], value: result[4] }
}

function parseArgs(args = process.argv.slice(2)) {

  const resultDict = {};

  args.forEach(arg => {
    let { prefix, key, value } = parseArg(arg);
    console.log(prefix, key, value);
    if ( !(prefix === undefined || key === undefined) ) {
      resultDict[key] = (value === undefined) ? true : parseValue(value);
    }
  });

  return resultDict;
}

module.exports = parseArgs;

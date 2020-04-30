function parseUndefined(value) {
  if (typeof value === "undefined") return { succeed: true, value };
  if (value === "undefined") return { succeed: true, value: undefined };
  return { succeed: false, value };
}

function parseNull(value) {
  if (value === null) return { succeed: true, value };
  if (value === "null") return { succeed: true, value: null };
  return { succeed: false, value };
}

function parseBoolean(value) {
  if (typeof value === "boolean") return { succeed: true, value };
  if (value === "true") return { succeed: true, value: true };
  if (value === "false") return { succeed: true, value: false }
  return { succeed: false, value };
}

function parseNumber(value) {
  if (value === "") return { succeed: false, value };
  if (typeof value === "number") return { succeed: true, value };
  const result = Number(value);
  if (!isNaN(result)) return { succeed: true, value: result };
  return { succeed: false, value };
}

function parseArray(value) {
  if (Array.isArray(value)) return { succeed: true, value };
  if (value.charAt(0) === "[") {
    try {
      let _value; eval(`_value = ${value}`);
      return { succeed: true, value: _value };
    } catch {
      return { succeed: false, value };
    }
  }
  return { succeed: false, value };
}

function parseObject(value) {
  if (typeof value === "object" && !Array.isArray(value)) return { succeed: true, value };
  if (value.charAt(0) === "{") {
    try {
      let _value; eval(`_value = ${value}`);
      return { succeed: true, value: _value };
    } catch {
      console.log("caught");
      return { succeed: false, value };
    }
  }
  return { succeed: false, value };
}

function parseString(value) {
  if (typeof value === "string") return { succeed: true, value};
  if (typeof value === "object") return { succeed: true, value: JSON.stringify(value) };
  return { succeed: true, value: value.toString() };
}

function parseArg(value) {
  let result;
  ((result = parseUndefined(value)).succeed) ||
  ((result = parseNull(value)).succeed) ||
  ((result = parseBoolean(value)).succeed) ||
  ((result = parseNumber(value)).succeed) ||
  ((result = parseArray(value)).succeed) ||
  ((result = parseObject(value)).succeed) ||
  ((result = parseString(value)).succeed);
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

      resultDict[key] = (isNoValue) ? true : parseArg(value);
    }
  });

  return resultDict;
}

module.exports = parseArgs;

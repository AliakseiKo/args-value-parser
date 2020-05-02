/**
 * Converts input parameters to a unique value
 * @callback hashFunction
 * @param {...*} arguments - Еhe same parameters as the source function
 * @returns {*} - unique value for input parameters
 */

/**
 * Adds cache feature to the function
 * @param {Function} func - function which need to add cache feature
 * @param {hashFunction} hashFunc - function which converts input parameters to a unique value
 * @returns {Function} - function with cache feature
 */
function cacheDecorator(func, hashFunc) {
  const cache = new Map();
  const cachedFunc = function (...args) {
    const hash = hashFunc(...args);
    let result;
    if ((result = cache.get(hash)) !== undefined) return result;
    const newResult = func.call(this, ...args);
    const newHash = hashFunc(...args);
    cache.set(newHash, newResult);
    return newResult;
  }

  Object.setPrototypeOf(cachedFunc, func);

  return cachedFunc;
}

/**
 * Escapes chars in the string
 * @param {string} str - this string will be escaped
 * @param {string[]} chars - chars which need escape
 * @param {boolean} safety - do not escape already escaped chars
 * @returns {string} - the escaped string
 */
function escape(str, chars = [], safety = true) {
  const _chars = (chars.join()).replace( new RegExp(`([${escape.regExpStr}])`, "g"), "\\$&" );
  const regExp = (safety) ? `(?<!\\\\)[${_chars}]|\\\\(?![${_chars}]|\\\\)` : `[${_chars}]|\\\\`;
  return str.replace( new RegExp(regExp, "g"), "\\$&");
}

escape.regExp = ["^", "$", ".", "*", "+", "?", "(", ")", "[", "]", "{", "}", "|"];
escape.regExpStr = "\\" + escape.regExp.join("\\") + "\\\\";

escape = cacheDecorator(escape, (str, chars = [], safety = true) => {
  return `[${str}][${chars.join("")}][${safety && safety.toString()}]`;
});

export { escape, cacheDecorator };

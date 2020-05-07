/**
 * Converts input parameters to a unique value.
 * @callback hashFunction
 * @param {...*} arguments - The same parameters as the source function.
 * @returns {*} - unique value for input parameters.
 */

/**
 * Adds cache feature to the function.
 * @param {Function} func - a function which need to add cache feature.
 * @param {hashFunction} hashFunc - a function which converts input parameters to a unique value.
 * @returns {Function} - the input function with cache feature.
 */
function cacheDecorator(func, hashFunc = (...args) => args.toString()) {
  const cache = new Map();

  const cachedFunc = function (...args) {
    const hash = hashFunc(...args);

    const result = cache.get(hash);
    if (result !== undefined) return result;

    const newResult = func.call(this, ...args);
    const newHash = hashFunc(...args);
    cache.set(newHash, newResult);
    return newResult;
  };

  Object.setPrototypeOf(cachedFunc, func);
  Object.defineProperty(cachedFunc, "name", { value: func.name });

  return cachedFunc;
}

/**
 * Escapes chars in the string.
 * @param {string} str - this string will be escaped.
 * @param {Array.<string>} [chars=['\']] - chars which need escape.
 * @param {boolean} [safety=true] - do not escape already escaped chars.
 * @returns {string} - the escaped string.
 */
function escape(str, chars = ['\\'], safety = true) {
  return str.replace(
    new RegExp(`[${
      chars.join('').replace(new RegExp(`[${escape.regExpStr}]`, 'g'), '\\$&')
    }]`, 'g'),
    (match, offset, input) => {
      if (!safety) return `\\${match}`;
      const prevChar = input.charAt(offset - 1);
      if (prevChar === '\\') return match;
      const nextChar = input.charAt(offset + 1);
      if (match === '\\') {
        if (nextChar !== '\\' && chars.includes(nextChar)) return match;
        let count = 0;
        let currentChar;
        while ((++offset, ++count, (currentChar = input.charAt(offset)) === '\\'));
        if (chars.includes(currentChar)) ++count;
        if (!(count % 2)) return match;
      }
      return `\\${match}`;
    }
  );
}

escape.regExp = ['^', '$', '|', '-', '.', '*', '+', '?', '(', ')', '[', ']', '{', '}', "\\"];
escape.regExpStr = `\\${escape.regExp.join('\\')}`;

const escapeCached = cacheDecorator(escape);

module.exports = { escape: escapeCached, cacheDecorator };

function cacher(func, hashFunc) {
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

function escape(str, chars = [], safety = true) {
  _chars = (chars.join()).replace( new RegExp(`([${escape.regExpStr}])`, "g"), "\\$&" );
  const regExp = (safety) ? `(?<!\\\\)[${_chars}]|\\\\(?![${_chars}]|\\\\)` : `[${_chars}]|\\\\`;
  return str.replace( new RegExp(regExp, "g"), "\\$&");
}

escape.regExp = ["^", "$", ".", "*", "+", "?", "(", ")", "[", "]", "{", "}", "|"];
escape.regExpStr = "\\" + escape.regExp.join("\\") + "\\\\";

escape = cacher(escape, (str, chars = [], safety = true) => {
  return `[${str}][${chars.join("")}][${safety && safety.toString()}]`;
});

module.exports = { escape, cacher };

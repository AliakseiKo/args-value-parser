function replacer(str) {
  return str.replace(/<(.*?)>/g, '&lt;$1&gt;');
}

function descriptionReplace(node) {
  if (node && typeof node.description === 'string') node.description = replacer(node.description);
}

module.exports = {
  handlers: {
    newDoclet({ doclet }) {
      descriptionReplace(doclet);
      doclet.params && doclet.params.forEach((param) => descriptionReplace(param));
      doclet.returns && doclet.returns.forEach((_return) => descriptionReplace(_return));
      doclet.properties && doclet.properties.forEach((property) => descriptionReplace(property));
    }
  }
};

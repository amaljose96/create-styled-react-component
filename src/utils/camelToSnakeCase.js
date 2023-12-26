module.exports = function(camelCase){
    return camelCase
      .replace(/([A-Z])/g, (_, group) => `_${group.toLowerCase()}`)
      .replace(/^_/, '');
}
const vds = callback => (...argument) => callback(vds(callback))(...argument);

module.exports = vds;
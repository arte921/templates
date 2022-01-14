const fs = require("fs/promises");

module.exports = async (pad) => JSON.parse(
    await fs.readFile(pad)
);
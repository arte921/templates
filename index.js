const writeTXT = require('./functies/writeTXT.js');
const leesJSON = require('./functies/leesJSON.js');

const { leesMap } = require('./functies/leesMap.js');
const path = require("path");

// E van Eerste teken uppercase
Object.defineProperty(String.prototype, "e", {
    get: function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
});

// A van Alle tekens uppercase
Object.defineProperty(String.prototype, "a", {
    get: function () {
        return this.toUpperCase();
    }
});

['e', 'a'].forEach(l => Object.defineProperty(Array.prototype, l, {
    get: function () {
        return this.map(e => e[l]);
    }
}));

// J van Join
Array.prototype.j = function (sep = ", ", nl = " en ") {
    return this.length > 1 ? this.slice(0, -1).join(sep) + nl + this[this.length - 1] : this[0];
};

(async () => {
    const projecten = (await leesMap("./generators")).paden;

    for (const project of projecten) {
        const itemsPad = project.paden.find((pad) => path.basename(pad) == "items.json");
        const generatorPaden = project.paden.filter((pad) => path.basename(pad).endsWith(".js")).map(pad => "./" + pad);

        const api = await leesJSON(itemsPad);

        const items = Symbol.iterator in Object(api) ? api.reduce((items, item) => ({ ...items, [item]: item }), {}) : api;

        const generators = generatorPaden.map(pad => ({
            generator: require(pad),
            naam: path.basename(pad).slice(0, -3)
        }));

        for (const generator of generators) {
            const alleItems = [];
            for (const [naam, item] of Object.entries(items)) {
                const code = generator.generator(naam, item, items);

                await writeTXT(path.join("./code", project.naam, generator.naam), naam, code);

                alleItems.push(code);
            }
            await writeTXT(path.join("./code", project.naam, generator.naam), "alles", alleItems.join("\n"));
        }
    }
})();

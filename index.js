const writeTXT = require('./functies/writeTXT.js');
const leesJSON = require('./functies/leesJSON.js');

const { leesMap } = require('./functies/leesMap.js');
const path = require("path");
const invertedSwitch = require('./functies/invertedSwitch.js');

(async () => {
    const projecten = (await leesMap("./generators")).paden;

    for (const project of projecten) {
        const itemsPad = project.paden.find((pad) => path.basename(pad) == "items.json");
        const generatorPaden = project.paden.filter((pad) => path.basename(pad).endsWith(".js")).map(pad => "./" + pad);

        const api = await leesJSON(itemsPad);
        const items = api.items;
        const generators = generatorPaden.map(pad => ({
            generator: require(pad),
            naam: path.basename(pad).slice(0, -3)
        }));

        for (const generator of generators) {
            const alleItems = [];
            for (const item of items) {
                try {
                    const code = generator.generator;

                    const argumenten = code
                        .toString()
                        .match(/^\(((.|\n)*)\)/)[1]
                        .split(",")
                        .map(argument => argument.trim())
                        .map(argument => invertedSwitch([
                            [
                                argument => argument.match(/([a-zA-Z]+) ?= ?"([a-z]+)"/),
                                (_, match) => {
                                    const naam = match[1];
                                    const operator = match[2];
                                    return invertedSwitch([
                                        ["lookup", item[naam]]
                                    ], operator)
                                }
                            ],
                            ["items", items],
                            ["item", item],
                            [
                                
                            ]
                        ], argument))



                    console.log(argumenten);

                    if (item.naam) {
                        await writeTXT(path.join("./code", project.naam, generator.naam), item.naam[0], code);
                    }

                    alleItems.push(code);

                } catch (e) {
                    console.log(e);
                };
            }
            await writeTXT(path.join("./code", project.naam, generator.naam), "alles", alleItems.join("\n"));
        }
    }
})();

const vds = callback => (...argument) => callback(vds(callback))(...argument);

vds(zelf => (i, f = 1, v = 0) => {
    console.log(i, f);
    if (i != 0) zelf(i - 1, f + v, f);
})(10);


const invertedSwitch = (switches, waarde) => {
    for (const [test, succes] of switches) {
        const testResultaat = invertedSwitch([
            [!succes, test]
            [typeof test == Boolean, test],
            [test instanceof Function, test(waarde)],
            [test instanceof RegExp, waarde.match(test)],
            [test == waarde]
        ]);
        
        if (testResultaat) return invertedSwitch([
            [!succes, test],
            [succes instanceof Function, succes(waarde, testResultaat)],
            [succes]
        ]);
    }
};

module.exports = invertedSwitch;
const vds = require('./vds');

const invertedSwitch = (switches, waarde) => {
    for (const [test, succes] of switches) {
        const testResultaat = invertedSwitch([
            [!succes, test]
            [typeof test == Boolean, test],
            [test instanceof Function, test(waarde)],
            [test instanceof RegExp, waarde.match(test)],
            [test == waarde]
        ]);
        
        if (testResultaat) return vds(succesToepasser => succes => invertedSwitch([
            [!succes, succesToepasser(test)],
            [succes instanceof Function, succes(waarde, testResultaat)],
            [succes]
        ]))(succes);
    }
};

module.exports = invertedSwitch;
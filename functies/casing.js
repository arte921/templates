const invertedSwitch = require('./invertedSwitch');
const Eh = string => string.charAt(0).toUpperCase() + string.slice(1);
const AH = string => string.toUpperCase();


const kopieerCasing = (origineel, kopie) => invertedSwitch([
    [string => string.match(/^[a-z]+[A-Z]/), () => kopie]
    [string => string.match(/^[^a-z]*$/), AH],
    [string => string.match(/^[A-Z]+[a-z]/), Eh]
], origineel);

module.exports = {
    kopieerCasing,
    Eh,
    AH
};
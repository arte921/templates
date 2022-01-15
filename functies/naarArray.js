module.exports = item => item ? Object
    .entries(item)
    .map(([k, v]) => ({
        naam: k,
        item: v
    })) : [];
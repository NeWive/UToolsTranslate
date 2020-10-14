const { readFileSync } = require('fs');

window.readFile = function (p) {
    try {
        return readFileSync(p)
    } catch (e) {
        return e;
    }
}



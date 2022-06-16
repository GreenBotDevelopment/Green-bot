const client = require("./BaseClient");
const config = require("../config.js");
let client_1 = new client(config);

client_1.start({
    token: config.token,
    devMode: false
})
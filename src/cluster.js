const client = require("./BaseClient");
const { token } = require("../config.js");
let client_1 = new client();

client_1.start({
    token: token,
    devMode: false
})
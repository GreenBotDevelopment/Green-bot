const client = require("./BaseClient");
const { token, spotify } = require("../config.js");
let client_1 = new client(spotify);

client_1.start({
    token: token,
    devMode: false
})
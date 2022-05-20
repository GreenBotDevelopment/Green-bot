const client = require("./BaseClient"),
    { token } = require("../config.js"),
    client_1 = new client();
    client_1.login(token);

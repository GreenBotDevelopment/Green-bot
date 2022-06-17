const config = require("./config.js"),
    { Manager: Manager } = require("discord-hybrid-sharding"),
    manager = new Manager("./src/cluster.js", { mode: "process", token: config.token });
manager.spawn({ timeout: -1 });
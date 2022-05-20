const { token: token } = require("./config.js"),
    { Manager: Manager } = require("discord-hybrid-sharding"),
    manager = new Manager("./src/cluster.js", { mode: "process", token: token });
manager.spawn({ timeout: -1 });

const { ShardingManager } = require("discord.js");
const config = require("./config")
const manager = new ShardingManager("./index.js", {
    token: config.token,
    shardArgs: process.argv,
    // totalShards: 3,
});
console.log("[Shards] Starting spawn");
manager.spawn();

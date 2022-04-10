const { ShardingManager } = require("discord.js");
const { token, shards }  = require("./config");
const manager = new ShardingManager("./index.js", {
    token: config.token,
    shardArgs: process.argv,
    totalShards: shards ?? "auto",
});
console.log("[Shards] Starting spawn");
manager.spawn({
    timeout: -1
});

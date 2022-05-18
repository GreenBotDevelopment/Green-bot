const { ShardingManager } = require("discord.js");
const { token, shards }  = require("./config");
if(token) {
    const manager = new ShardingManager("./index.js", {
        token: token,
        shardArgs: process.argv,
        totalShards: shards ?? "auto",
    });
    console.log("[Shards] Starting spawn...");
    manager.spawn({
        timeout: -1
    });
} else return console.log("[Error] Please add your token bot in file config.");

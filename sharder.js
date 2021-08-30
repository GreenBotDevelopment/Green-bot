const { ShardingManager } = require("discord.js");
const AutoPoster = require("topgg-autoposter")
const config = require("./config")
const manager = new ShardingManager("./index.js", {
    token: require("./config.js").token,
    shardArgs: process.argv,
    // totalShards: 3,
});
if (config.topgg) {
    const poster = new AutoPoster(config.topgg, manager)
    poster.on('posted', (stats) => { // ran when succesfully posted
        console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`)
    })
}
console.log("[Shards] Starting spawn");
manager.spawn();
"use strict";
//IMPORTANT: If you need help with the installation of Green-bot, you can join my server here: https://discord.gg/Q5QSbAHaXB for help
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_hybrid_sharding_1 = require("discord-hybrid-sharding");
const config_1 = tslib_1.__importDefault(require("./module/config"));
const manager = new discord_hybrid_sharding_1.Manager("./module/src/cluster.js", {
    mode: "process",
    token: config_1.default.token,
    shardsPerClusters: 10
});
manager.extend(new discord_hybrid_sharding_1.ReClusterManager({
    delay: 2000,
    timeout: -1,
    restartMode: 'gracefulSwitch',
}));
manager.on("clusterCreate", (cluster) => {
    cluster.on("ready", () => {
        if (config_1.default.debug)
            console.log("[Cluster Manager ==> Cluster] Cluster \"" + cluster.id + "\" entered ready");
    });
    cluster.on("reconnecting", () => {
        if (config_1.default.debug)
            console.log("[Cluster Manager ==> Cluster] Cluster \"" + cluster.id + "\" is reconnecting to discord WS");
    });
    cluster.on('message', message => {
        console.log(message);
        if (message === "restart") {
            manager.recluster.start({
                delay: 2000,
                timeout: -1,
                shardsPerClusters: 15,
                restartMode: 'gracefulSwitch'
            });
        }
    });
    if (config_1.default.debug)
        console.log("[Cluster Manager ==> Cluster] Cluster \"" + cluster.id + "\" created");
});
manager
    .spawn({ timeout: -1 })
    .then(() => {
    console.log("[Cluster Manager] The bot is now ready and all shards are connected to discord Websocked.\nCurrent Debug Mode is set to: " + config_1.default.debug + "");
});

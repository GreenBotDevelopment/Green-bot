import { Manager, ReClusterManager } from "discord-hybrid-sharding";
import { Client } from "discord-cross-hosting";
import config from "./module/config";


const client = new Client({
    agent: 'bot',
    host: '', // Domain without https
    port: 4444, // Proxy Connection (Replit) needs Port 443
    // handshake: true, When Replit or any other Proxy is used
    authToken: '',
    rollingRestarts: false, // Enable, when bot should respawn when cluster list changes.
});
client.on('debug', console.log);
client.connect();

const manager = new Manager("./module/src/cluster.js", {
    mode: "process",
    token: config.token,
    shardsPerClusters: 10,

});


manager.extend(
    new ReClusterManager({
        delay: 2000,
        timeout: -1,
        restartMode: 'gracefulSwitch',
    })
)

manager.on("clusterCreate", (cluster) => {
    cluster.on("ready", () => {
        if (config.debug) console.log("[Cluster Manager ==> Cluster] Cluster \"" + cluster.id + "\" entered ready")
    })
    cluster.on("reconnecting", () => {
        if (config.debug) console.log("[Cluster Manager ==> Cluster] Cluster \"" + cluster.id + "\" is reconnecting to discord WS")
    })
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
    })
    if (config.debug) console.log("[Cluster Manager ==> Cluster] Cluster \"" + cluster.id + "\" created")
})

client.listen(manager)
client
    .requestShardData()
    .then(e => {
        if (!e) return;
        if (!e.shardList) return;
        manager.totalShards = e.totalShards;
        manager.totalClusters = e.shardList.length;
        manager.shardList = e.shardList;
        manager.clusterList = e.clusterList;
        manager.spawn({ timeout: -1 }).then(() => {
            console.log("[Cluster Manager] The bot is now ready and all shards are connected to discord Websocked.\nCurrent Debug Mode is set to: " + config.debug + "")
        })
    })
    .catch(e => console.log(e));

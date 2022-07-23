    //IMPORTANT: If you need help with the installation of Green-bot, you can join my server here: https://discord.gg/Q5QSbAHaXB for help


import { Manager, ReClusterManager } from "discord-hybrid-sharding";
import config from "./module/config";

const manager = new Manager("./module/src/cluster.js", {
    mode: "process",
    token: config.token,
    shardsPerClusters: 10
});

manager.extend(
    new ReClusterManager({
        delay: 2000,
        timeout: -1,
        restartMode: 'gracefulSwitch',
    })
)

manager.on("clusterCreate", (cluster) => {
    cluster.on("ready" ,()=>{
        if(config.debug) console.log("[Cluster Manager ==> Cluster] Cluster \""+cluster.id+"\" entered ready")
    })
    cluster.on("reconnecting",()=>{
        if(config.debug) console.log("[Cluster Manager ==> Cluster] Cluster \""+cluster.id+"\" is reconnecting to discord WS")
    })
    cluster.on('message', message => {
        console.log(message);
       if(message === "restart"){
        manager.recluster && manager.recluster.start(  {
            delay: 2000,
            timeout: -1,
            shardsPerClusters: 15,
            restartMode: 'gracefulSwitch'
        } );
    }
    })
    if(config.debug) console.log("[Cluster Manager ==> Cluster] Cluster \""+cluster.id+"\" created")
})

manager
.spawn({ timeout: -1 })
.then(() => {
    console.log("[Cluster Manager] The bot is now ready and all shards are connected to discord Websocked.\nCurrent Debug Mode is set to: "+config.debug+"")
})
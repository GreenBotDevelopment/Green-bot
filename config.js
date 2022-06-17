module.exports = {
    //IMPORTANT: If you need help with the installation of Green-bot, you can join our support server here: https://green-bot.app/discord
    // Complete it carefuly else it won't work, check the readme for more informations
    lavalink: [
        { name: "1", url: "LAVALINK_IP:PORT", auth: "LAVALINK_AUTH", secure: null },
    ],
    // Optional, for loading playlists with more than 100 tracks ( Else using a scaper )
    spotify: { clientId: "", clientSecret: "", cacheResults: !0, cacheLifetime: 36e5 },
    // The wrapper used to connect to the lavalink server: https://deivu.github.io/Shoukaku
    shoukaku: { moveOnDisconnect: !0, resumable: !0, closedEventDelay: 1e3, resumableTimeout: 500, reconnectTries: 5, restTimeout: 3e4 },
    // The database. Create a database on Atlas/ Your vps and copy the connection url here. Additional informations: https://www.mongodb.com/
    mongo: { url: "mongodb://localhost:27017/test", options: { maxPoolSize: 200, useNewUrlParser: !0, useUnifiedTopology: !0, autoIndex: !0, serverSelectionTimeoutMS: 45e3, socketTimeoutMS: 8e5, keepAlive: !0, connectTimeoutMS: 5e5 } },
    // The discord bot token for discord developers: https://discord.com/developpers/bots
    token: "DISCORD_BOT_TOKEN",
    slashCommands: {
        load: true,
        clientId: ""
    }
};
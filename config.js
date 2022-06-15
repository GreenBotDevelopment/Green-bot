module.exports = {
    lavalink: [
        { name: "1", url: "LAVALINK_IP:PORT", auth: "LAVALINK_AUTH" },
    ],
    spotify: { clientId: "", clientSecret: "", cacheResults: !0, cacheLifetime: 36e5 }
    shoukaku: { moveOnDisconnect: !0, resumable: !0, closedEventDelay: 1e3, resumableTimeout: 500, reconnectTries: 5, restTimeout: 3e4 },
    mongo: { url: "mongodb://localhost:27017/test", options: { maxPoolSize: 200, useNewUrlParser: !0, useUnifiedTopology: !0, autoIndex: !0, serverSelectionTimeoutMS: 45e3, socketTimeoutMS: 8e5, keepAlive: !0, connectTimeoutMS: 5e5 } },
    token: "DISCORD_BOT_TOKEN",
    premiumUrl: "", // Let this blank because this github is for non-commercial use 
};
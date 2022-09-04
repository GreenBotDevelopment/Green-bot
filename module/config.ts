export default {
    lavalink: [


    ],
    debug: false,
    clientId: "",
    voteLocks: ["speed", "replay", "voteskip", "8d", "bassboost", "shuffle", "distorsion", "filters", "nightcore", "resetfilters", "loop", "volume", "seek", "rewind", "forward", "24/7", "autoplay", "jump"],
    premiumCmd: ["rotation", "tremolo", "vibrato", "lowpass", "karaoke", "textchannel", "leavecleanup", "autoautoplay", "defaultVolume", "autoshuffle",],
    shoukaku: { moveOnDisconnect: true, alwaysSendResumeKey: true, resumeByLibrary: true, resume: true, closedEventDelay: 1e3, resumableTimeout: 1500, reconnectTries: 25, restTimeout: 15000 },
    mongo: { url: "", options: { maxPoolSize: 600, useNewUrlParser: true, useUnifiedTopology: true, autoIndex: false, serverSelectionTimeoutMS: 45e3, socketTimeoutMS: 8e5, keepAlive: true, connectTimeoutMS: 5e5 } },
    token: "",
    premiumUrl: "",
    dbl: "",
    spotify: [
      
    ]
};

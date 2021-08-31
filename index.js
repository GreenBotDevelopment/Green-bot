const fs = require("fs"),
    config = require("./config.js");
if (config.checkConfig) {
    const { checkConfig } = require("./util/functions")
    const result = checkConfig(config).then(result => {
        if (result) {
            console.log("Config error")
            process.exit(0);
        }
    })

}
const GreenBot = require("./base/GreenBot");
const client = new GreenBot({
    fetchAllMembers: !0,
    autoReconnect: !0,
    messageCacheMaxSize: 20,
    partials: ["MESSAGE", "CHANNEL", "GUILD_MEMBER", "REACTION", "GUILD_VOICE_STATES"],
    intents: [
        "GUILD_MEMBERS",
        "GUILDS",
        "GUILD_VOICE_STATES",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_BANS",
        "GUILD_INVITES",
        "GUILD_VOICE_STATES",
        "DIRECT_MESSAGES",
        "GUILD_INTEGRATIONS",
        "GUILD_WEBHOOKS",
        "GUILD_MESSAGE_TYPING",
        "DIRECT_MESSAGES",
        "DIRECT_MESSAGE_REACTIONS",
        "DIRECT_MESSAGE_TYPING",
        "GUILD_MESSAGE_REACTIONS",
    ],
    allowedMentions: {
        parse: ["users", "roles"]
    },
});
const util = require("util");
require("./util/extenders.js");
const readdir = util.promisify(fs.readdir),
    mongoose = require("mongoose");
mongoose
    .connect(config.database.MongoURL, { useNewUrlParser: !0, useUnifiedTopology: !0, useFindAndModify: !1 })
    .then(() => {
        console.log("[MongoDB] : Ready");
    })
    .catch((e) => {
        console.log("MongoDB Error:" + e);
    });
const init = async() => {
    fs.readdirSync("./commands").filter((e) => e.endsWith(".js"));
    const e = await readdir("./commands/");
    console.log(`[Commands] ${e.length} Categories loaded.`),
        e.forEach(async(e) => {
            (await readdir("./commands/" + e + "/"))
            .filter((e) => "js" === e.split(".").pop())
                .forEach((t) => {
                    const n = require(`./commands/${e}/${t}`);
                    client.commands.set(n.name, n);
                });
        });
    const t = await readdir("./events/discord");
    console.log(`[Events] ${t.length} events loaded.`),
        t.forEach((e) => {
            const t = e.split(".")[0];
            const n = require(`./events/discord/${e}`);
            client.on(t, (...e) => n.execute(...e, client)), delete require.cache[require.resolve(`./events/discord/${e}`)];
        });
    const n = await readdir("./events/giveaways");
    n.forEach((e) => {
            const t = e.split(".")[0];
            const n = require(`./events/giveaways/${e}`);
            client.manager.on(t, (...e) => n.execute(...e, client)), delete require.cache[require.resolve(`./events/giveaways/${e}`)];
        }),
        fs.readdir("./events/player", (e, t) => {
            if (e) return console.error(e);
            t.forEach((e) => {
                const t = require(`./events/player/${e}`);
                let n = e.split(".")[0];
                client.player.on(n, t.bind(null, client));
            });
        });
};
init(), client.login(config.token).catch(err => {
    console.log("[Discord login] Please provide a valid discord bot token\n" + err + "")
});
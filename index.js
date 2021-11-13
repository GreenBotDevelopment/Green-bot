const fs = require("fs"),
    config = require("./config.js");
if (config.checkConfig) {
    const { checkConfig } = require("./util/functions")
    checkConfig(config).then(result => {
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
const readdir = util.promisify(fs.readdir);
   client.player.on("trackStart", async(queue, track) => {
        if (!queue.metadata) return console.log("Not metadata")
        if (queue.metadata.controller) {
            const embed = new MessageEmbed()
                .setAuthor(track.requestedBy.tag, track.requestedBy.displayAvatarURL(), "https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=bot&permissions=19456")
                .setDescription(`Send a music name/link bellow this message to play music.\n[Invite me](https://green-bot.app/invite) | [Premium](https://green-bot.app/premium) | [Dashboard](https://green-bot.app) | [Commands](https://green-bot.app/commands)`)
                .addField("Now playing", `[**${track.title}**](${track.url}) [<@${track.requestedBy.id}>] \`${track.duration}\``)
                .setImage(url = "https://cdn.discordapp.com/attachments/893185846876975104/900453806549127229/green_bot_banner.png")
                .setFooter(`${client.footer}`, client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor("#3A871F")
            return queue.metadata.message.edit({ embeds: [embed] })
        } else {
            if (queue.metadata.guildDB.announce) queue.metadata.channel.send({
                embeds: [{
                    color: queue.metadata.guildDB.color,
                    author: { name: "" + track.requestedBy.tag + " - Now playing", icon_url: track.requestedBy.displayAvatarURL(), url: "https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=bot&permissions=19456" },
                    description: `[${track.title}](${track.url}) [<@${track.requestedBy.id}>]`,
                }],
            }).then(m => setTimeout(() => m.delete(), track.durationMS))
        }
    })
    client.player.on("tracksAdd", async(queue, tracks) => {
        if (!queue.metadata || queue.metadata.controller) return
        let loadingTest = await queue.metadata.m.translate("ADDS", queue.metadata.guildDB.lang)
        queue.metadata.channel.send(loadingTest.replace("{tracks}", tracks.length))
        if (queue.metadata.guildDB.auto_shuffle) await queue.shuffle().then(queue.metadata.channel.send("`✅` Playlist automaticlly shuffled."))
    })
    client.player.on("trackAdd", async(queue, track) => {
        if (!queue.metadata || queue.metadata.controller) return console.log("Not metadata")
        let a = await queue.metadata.m.translate("MUSIC_ADDED", queue.metadata.guildDB.lang)
        queue.metadata.channel.send({
            embeds: [{
                color: queue.metadata.guildDB.color,
                description: `${a} **[${track.title}](${track.url})**`,
            }]
        })
    })
    client.player.on("queueEnd", async(queue, track) => {
        if (queue.metadata.controller) {
            const embed = new MessageEmbed()
                .setAuthor(`${client.footer}`, client.user.displayAvatarURL({ dynamic: true, size: 512 }), "https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=bot&permissions=66186704")
                .setDescription(`Send a music name/link bellow this message to play music.\n[Invite me](https://green-bot.app/invite) | [Premium](https://green-bot.app/premium) | [Dashboard](https://green-bot.app) | [Commands](https://green-bot.app/commands)`)
                .addField("Now playing", "__**Nothing playing**__")
                .setImage(url = "https://cdn.discordapp.com/attachments/893185846876975104/900453806549127229/green_bot_banner.png")

            .setFooter(`${client.footer}`, client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor("#3A871F")
            return queue.metadata.message.edit({ embeds: [embed] })
        }
        let loadingTest = await queue.metadata.m.translate("QUEUE_END", queue.metadata.guildDB.lang)
        queue.metadata.channel.send({ embeds: [{ title: "Queue Concluded", color: "#F0B02F", description: loadingTest }] })
    })
    client.player.on("connectionCreate", async(queue, connection) => {
        if (!queue.metadata || queue.metadata.controller) return console.log("Not metadata")
        let loadingTest = await queue.metadata.m.translate("JOINED", queue.metadata.guildDB.lang)
        queue.metadata.channel.send(loadingTest.replace("{channel}", connection.channel.name).replace("{text}", queue.metadata.channel)).then(console.log("VoiceConnection - Created"))
    })
    client.player.on("channelEmpty", async(queue, track) => {
        if (queue.metadata.controller) {
            const embed = new MessageEmbed()
                .setAuthor(`${client.footer}`, client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setDescription(`Send a music name/link bellow this message to play music.\n[Invite me](https://green-bot.app/invite) | [Premium](https://green-bot.app/premium) | [Dashboard](https://green-bot.app) | [Commands](https://green-bot.app/commands)`)
                .addField("Now playing", "__**Nothing playing**__")
                .setImage(url = "https://cdn.discordapp.com/attachments/893185846876975104/900453806549127229/green_bot_banner.png")

            .setFooter(`${client.footer}`, client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor("#3A871F")
            return queue.metadata.message.edit({ embeds: [embed] })
        }
        if (!queue.metadata.guildDB.h24) queue.connection.disconnect()

    })
    client.player.on("error", async(error) => {
        return

    })
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
        mongoose = require("mongoose");
        mongoose
            .connect(config.database.MongoURL, { useNewUrlParser: !0, useUnifiedTopology: !0, useFindAndModify: !1 })
            .then(() => {
                console.log("[MongoDB] : Ready");
            })
            .catch((e) => {
                console.log("MongoDB Error:" + e);
            });
    };
init(), client.login(config.token).catch(err => {
    console.log("[Discord login] Please provide a valid discord bot token\n" + err + "")
});

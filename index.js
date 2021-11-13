const fs = require("fs"),
    { getFreeClientID: getFreeClientID, setToken: setToken } = require("play-dl"),
    { Client: Client, Intents: Intents, Collection: Collection, MessageEmbed: MessageEmbed  } = require("discord.js"),
    client = new Client({
        messageCacheMaxSize: 20,
        intents: [Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
            Intents.FLAGS.GUILD_VOICE_STATES,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        ]
    }),
    util = require("util"),
    { Player } = require("discord-player"),
    readdir = util.promisify(fs.readdir),
    mongoose = require("mongoose");
client.config = require("./config.js"),
    client.cooldowns = [],
    client.footer =
    client.config.footer,
    client.commands = new Collection,
    client.player = new Player(client, client.config.player),
    getFreeClientID().then(e => { setToken({ soundcloud: { client_id: e } }) }),
    mongoose.connect(client.config.database.MongoURL, client.config.database.options).then(() => { console.log("[MongoDB]: Ready") })
    .catch(e => { console.log("[MongoDB]: Error\n" + e) });
const init = async function() {
    fs.readdirSync("./commands").filter(e => e.endsWith(".js"));
    const e = await readdir("./commands/");
    console.log(`[Commands] ${e.length} Categories loaded.`), e.forEach(async e => {
        (await readdir("./commands/" + e + "/")).filter(e => "js" === e.split(".").pop()).forEach(n => {
            const t = require(`./commands/${e}/${n}`);
            client.commands.set(t.name, t)
        })
    });
    const n = await readdir("./events/discord");
    console.log(`[Events] ${n.length} events loaded.`), n.forEach(e => {
        const n = e.split(".")[0],
            t = require(`./events/discord/${e}`);
        client.on(n, (...e) => t.execute(...e, client)), delete require.cache[require.resolve(`./events/discord/${e}`)]
    })
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
};
init(), client.login(client.config.token).catch(e => { console.log("[Discord login]: Please provide a valid discord bot token\n" + e) });

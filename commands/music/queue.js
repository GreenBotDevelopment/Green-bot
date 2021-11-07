const Discord = require('discord.js');
const { QueueRepeatMode } = require("discord-player");
module.exports = {
    name: 'queue',
    description: 'List every song that\'s waiting to be played along with the requester of that song.',
    cat: 'music',
    aliases: ["q"],
    botpermissions: ['CONNECT', 'SPEAK', "MANAGE_MESSAGES"],
    async execute(message, args, client, guildDB) {
        const queue = message.client.player.getQueue(message.guild.id)
        if (!queue || !queue.playing || !queue.current) {
            let err = await message.translate("NOT_MUSIC", guildDB.lang)
            return message.errorMessage(err)
        }
        if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) {
            return message.errorMessage("I need the `Manage messages` permissions for this command. (Pagination with reactions)")
        }
        if (args.length) return message.errorMessage("Want to play a song? Try `" + guildDB.prefix + "play`")
        const lang = await message.translate("QUEUE", guildDB.lang)
        const getRepeatMode = function(mode) {
            let text = "Disabled";
            if (mode == QueueRepeatMode.AUTOPLAY) {
                text = lang.autoplay
            } else if (mode == QueueRepeatMode.QUEUE) {
                text = lang.queue
            } else if (mode == QueueRepeatMode.TRACK) {
                text = lang.track
            } else {
                text = lang.disabled
            }
            return text
        }
        if (queue.tracks.length < 6) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`${lang.title} ${message.guild.name} `)
                .setURL(client.config.links.invite)
                .setColor(guildDB.color)
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }), client.config.links.invite)
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .addField(lang.a, `[${queue.current.title}](${queue.current.url}) | \`${lang.request} ${queue.current.requestedBy.username} ${queue.current.duration} \``)
                .addField(`__${lang.next}__`, queue.tracks.map((m, i) => `\`#${i + 1}\`  [${m.title.slice(0,80)}](${m.url}) \`${lang.request} ${m.requestedBy.username} ${m.duration}\``).join("\n") || lang.no)
                .addField(lang.b, getRepeatMode(queue.repeatMode), true)
                .addField("DJ", `<@${queue.metadata.dj.id}>`, true)
            message.channel.send({ embeds: [embed], allowedMentions: { repliedUser: false } })
        } else {
            let i0 = 0;
            let i1 = 6;
            let page = 1;
            let description = queue.tracks.map((m, i) => `\`#${i + 1}\`  [${m.title.slice(0,80)}](${m.url}) \`${lang.request} ${m.requestedBy.username} ${m.duration}\``).slice(0, 6).join("\n");
            const embed = new Discord.MessageEmbed()
                .setTitle(`${lang.title} ${message.guild.name} `)
                .setURL(client.config.links.invite)
                .setColor(guildDB.color)
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .addField(lang.a, `[${queue.current.title}](${queue.current.url}) | \`${lang.request} ${queue.current.requestedBy.username} ${queue.current.duration} \``)
                .setDescription(description)
                .addField(lang.b, getRepeatMode(queue.repeatMode), true)
                .addField("DJ", `<@${queue.metadata.dj.id}>`, true)

            const msg = await message.channel.send({ embeds: [embed], allowedMentions: { repliedUser: false } });
            await msg.react("⬅");
            await msg.react("➡");
            const filter = (reaction, user) => user.id === message.author.id;
            const c = msg.createReactionCollector({ filter, time: 1000000 });
            c.on("collect", async reaction => {
                if (reaction.emoji.name === "⬅") {
                    i0 = i0 - 6;
                    i1 = i1 - 6;
                    page = page - 1
                    if (i0 < 0) return;
                    if (page < 1) return;
                    let description =
                        queue.tracks.map((m, i) => `\`#${i + 1}\`  [${m.title.slice(0,80)}](${m.url}) \`${lang.request} ${m.requestedBy.username} ${m.duration}\``).slice(i0, i1).join("\n");
                    embed.setDescription(description);
                    msg.edit({ embeds: [embed] });
                }
                if (reaction.emoji.name === "➡") {
                    i0 = i0 + 6;
                    i1 = i1 + 6;
                    page = page + 1
                    if (i1 > queue.tracks.length + 6) return;
                    if (i0 < 0) return;
                    let description =
                        queue.tracks.map((m, i) => `\`#${i + 1}\`  [${m.title.slice(0,80)}](${m.url}) \`${lang.request} ${m.requestedBy.username} ${m.duration}\``).slice(i0, i1).join("\n");
                    embed.setDescription(description);
                    msg.edit({ embeds: [embed] });
                }
                await reaction.users.remove(message.author.id);
            })
        }
    },
};
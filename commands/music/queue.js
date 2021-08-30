const Discord = require('discord.js');
module.exports = {
    name: 'queue',
    description: 'affiche tous les sons dans la queue',
    cat: 'music',
    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args) {
        const voice = message.member.voice.channel;
        if (!voice) {
            let err = await message.translate("NOT_VOC")
            return message.errorMessage(err)
        }
        if (!message.client.player.getQueue(message.guild.id) || !message.client.player.getQueue(message.guild.id).playing) {
            let err = await message.translate("NOT_MUSIC")
            return message.errorMessage(err)
        }
        const lang = await message.translate("QUEUE")
        const util = await message.translate("DISABLED/ENABLED")
        const queue = message.client.player.getQueue(message.guild.id);
        if (queue.tracks.length < 8) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Queue (${queue.tracks.length} ${lang.c})`)
                .setColor(message.guild.settings.color)
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .addField(`Queue `, queue.tracks.map((m, i) => `**#${i + 1}**  [${m.title}](${m.url})`).join("\n") || "Nothing in the queue")
                .addField(lang.a, `\`${queue.current.title}\``)
                .addField(lang.b, `${queue.repeatMode ? util.enabled: util.disable}`)
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
        } else {
            let i0 = 0;
            let i1 = 8;
            let page = 1;
            let description = `Queue (${queue.tracks.length} ${lang.c}) \n\n` +
                queue.tracks.map((track, i) => `**#${i + 1}**  [${track.title}](${track.url})`).slice(0, 8).join("\n");
            const embed = new Discord.MessageEmbed()
                .setColor(message.guild.settings.color)
                .setTitle(`Queue (${page}/${Math.ceil(queue.tracks.length / 8)})`)
                .setDescription(description)
                .addField(lang.a, `**${queue.current.title} **
            `).addField(lang.b, `${queue.repeatMode ? util.enabled: util.disable}
            `)
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            const msg = await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });

            await msg.react("⬅");
            await msg.react("➡");

            const filter = (reaction, user) => user.id === message.author.id;
            const c = msg.createReactionCollector({ filter, time: 1000000 });

            c.on("collect", async reaction => {
                if (reaction.emoji.name === "⬅") {
                    i0 = i0 - 8;
                    i1 = i1 - 8;
                    page = page - 1

                    if (i0 < 0) return;
                    if (page < 1) return;

                    let description = `Queue (${queue.tracks.length} ${lang.c}) \n\n` +
                        queue.tracks.map((track, i) => `**#${i + 1}**  [${track.title}](${track.url})`).slice(i0, i1).join("\n");

                    embed.setTitle(`Queue (${page}/${Math.ceil(queue.tracks.length / 8)})`)
                        .setDescription(description);

                    msg.edit({ embeds: [embed] });
                }

                if (reaction.emoji.name === "➡") {
                    i0 = i0 + 8;
                    i1 = i1 + 8;
                    page = page + 1

                    if (i1 > queue.tracks.length + 8) return;
                    if (i0 < 0) return;

                    let description = `Queue (${queue.tracks.length} ${lang.c}) \n\n` +
                        queue.tracks.map((track, i) => `**#${i + 1}**  [${track.title}](${track.url})`).slice(i0, i1).join("\n");

                    embed.setTitle(`Page: ${page}/${Math.ceil(queue.tracks.length / 8)}`)
                        .setDescription(description);

                    msg.edit({ embeds: [embed] });
                }

                await reaction.users.remove(message.author.id);
            })
        }













    },
};
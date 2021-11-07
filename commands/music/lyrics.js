const Discord = require('discord.js');
const fetch = require("node-fetch")
module.exports = {
    name: 'lyrics',
    description: 'Donne les paroles de la musique indiquée.',
    cat: 'music',
    usage: '<music>',
    premium: true,
    exemple: 'Never gonna give you up',
    async execute(message, args, client, guildDB, cmd) {
        if (!args.length) {
            const queue = message.client.player.getQueue(message.guild.id);
            if (!queue || !queue.playing) {
                return message.usage(guildDB, cmd)
            }
            const songName = queue.current.title
            const err = await message.translate("LIRYCS", guildDB.lang)
            try {
                const songNameFormated = songName
                    .toLowerCase()
                    .replace(/\(lyrics|lyric|official music video|audio|official|official video|official video hd|clip officiel|clip|extended|hq\)/g, "")
                    .split(" ").join("%20");
                const url = "https://some-random-api.ml/lyrics?title=" + encodeURIComponent(songNameFormated) + ""
                const res = await fetch(url);
                const x = await res.json();
                if (!x.title) return message.usage(guildDB, cmd)
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }), client.config.links.invite)
                    .setTitle(`${x.title ? x.title : songName}`)
                    .setColor(guildDB.color)
                    .setDescription(`\`\`\`diff\n${x.lyrics.slice(0,4000)}\`\`\``)
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                return message.channel.send({ embeds: [embed] })
            } catch (e) {
                return message.usage(guildDB, cmd)
            }
        } else {
            const songName = args.join(" ");
            const err = await message.translate("LIRYCS", guildDB.lang)
            const songNameFormated = songName
                .toLowerCase()
                .replace(/\(lyrics|lyric|official music video|audio|official|official video|official video hd|clip officiel|clip|extended|hq\)/g, "")
                .split(" ").join("%20");
            const url = "https://some-random-api.ml/lyrics?title=" + encodeURIComponent(songNameFormated) + ""
            const res = await fetch(url);
            const x = await res.json();
            if (!x.title) return message.errorMessage(err.replace("{songName}", songName))
            const embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }), client.config.links.invite)
                .setTitle(`${x.title ? x.title : songName}`)
                .setColor(guildDB.color)
                .setDescription(`\`\`\`diff\n${x.lyrics.slice(0,4000)}\`\`\``)
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            return message.channel.send({ embeds: [embed] })
        }
    },
};
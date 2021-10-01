const Discord = require('discord.js');
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const Welcome = require('../../database/models/Welcome');
const { Lyrics } = require("@discord-player/extractor");

module.exports = {
    name: 'lyrics',
    description: 'Donne les paroles de la musique indiquée.',
    cat: 'music',
    usage: '<music>',
    exemple: 'Never gonna give you up',

    async execute(message, args) {
        if (!args.length) {
            const queue = message.client.player.getQueue(message.guild.id);
            if (!queue || !queue.playing) {
                return message.usage()

            }
            const songName = queue.current.title
            const err = await message.translate("LIRYCS")
            try {
                const songNameFormated = songName
                    .toLowerCase()
                    .replace(/\(lyrics|lyric|official music video|audio|official|official video|official video hd|clip officiel|clip|extended|hq\)/g, "")
                    .split(" ").join("%20");

                Lyrics(songNameFormated)
                    .then(x => {
                        if (!x.title) return message.usage()

                        const embed = new Discord.MessageEmbed()
                            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                            .setTitle(`${x.title ? x.title : songName}`)
                            .setURL(x.url)
                            .setColor(message.guild.settings.color)
                            .setDescription(`\`\`\`diff\n${x.lyrics}\`\`\``)
                            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                        return message.channel.send({ embeds: [embed] })
                    })
                    .catch((e) => {
                        return message.usage()

                    });


            } catch (e) {
                return message.usage()

            }
        } else {

            const songName = args.join(" ");

            const err = await message.translate("LIRYCS")

            try {

                const songNameFormated = songName
                    .toLowerCase()
                    .replace(/\(lyrics|lyric|official music video|audio|official|official video|official video hd|clip officiel|clip|extended|hq\)/g, "")
                    .split(" ").join("%20");

                try {

                    Lyrics(songNameFormated)
                        .then(x => {
                            if (!x.title) return message.errorMessage(err.replace("{songName}", songName))

                            const embed = new Discord.MessageEmbed()
                                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                                .setTitle(`${x.title ? x.title : songName}`)
                                .setURL(x.url)
                                .setColor(message.guild.settings.color)
                                .setDescription(`\`\`\`diff\n${x.lyrics}\`\`\``)
                                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                            return message.channel.send({ embeds: [embed] })
                        })
                        .catch((e) => {
                            console.log(e)
                            return message.errorMessage(err.replace("{songName}", songName))

                        });


                } catch (e) {
                    return message.errorMessage(err.replace("{songName}", songName))

                }


            } catch (e) {
                return message.errorMessage(err.replace("{songName}", songName))

            }
        }










    },
};
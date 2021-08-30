const discord = require('discord.js');
const fetch = require("node-fetch");
const { parse } = require("twemoji-parser");
const TikTokScraper = require('tiktok-scraper');
const number = require('easy-number-formatter')
module.exports = {
    name: 'tiktok',
    description: 'Gives information on a tiktok profile',
    aliases: ['tkt'],
    usage: '<username>',
    exemple: 'test',
    cat: 'utilities',
    guildOnly: true,
    args: true,
    async execute(message, args) {
        const lang = await message.translate("TIKTOK")
        try {
            const user = await TikTokScraper.getUserProfileInfo(args[0]);
            if (!user) {
                return message.errorMessage(lang.error.replace("{text}", args[0]))
            }
            const userbe = new discord.MessageEmbed()
                .setColor('#b434eb')
            if (user.user.verified == true) {
                userbe.setTitle(`@${user.user.uniqueId} <:checkbleu:834014123791482910>`)
            } else {
                userbe.setTitle(`@${user.user.uniqueId}`)
            }
            userbe.setURL(`https://www.tiktok.com/@${user.user.uniqueId}`)
                .setThumbnail(user.user.avatarThumb)
                .addField(lang.a, `${user.user.uniqueId}`, true)
                .addField(lang.b, `${user.user.nickname}`, true)
            if (user.user.signature == '') {
                userbe.addField("`📜` Bio", lang.c)
            } else {
                userbe.addField("`📜` Bio", `${user.user.signature}`)
            }
            userbe.addField(lang.d, number.formatNumber(`${user.stats.followerCount}`), true)
                .addField(lang.e, number.formatNumber(`${user.stats.followingCount}`), true)
                .addField(lang.f, number.formatNumber(`${user.stats.heartCount}`), true)
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

            message.reply({ embeds: [userbe], allowedMentions: { repliedUser: false } })
        } catch (error) {
            if (message.client.log) console.log(error)
            return message.errorMessage(lang.error.replace("{text}", args[0]))
        }
    },
};
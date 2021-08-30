const emojiss = require('../../emojis.json')
const Discord = require('discord.js');
const fetch = require("node-fetch");
const { parse } = require("twemoji-parser");
let isUrl = require("is-url");
module.exports = {
    name: 'deleteemoji',
    description: 'Deletes an emoji.',
    aliases: ['dele', "delemoji"],
    usage: '<emoji>',
    cat: 'utilities',
    args: true,
    guildOnly: true,
    botpermissions: ['MANAGE_EMOJIS'],
    permissions: ['MANAGE_EMOJIS'],
    async execute(message, args) {
        const text = args[0]
        if (text.split(':')[2] === undefined) {
            const err = await message.translate("EMOJI_ERROR")
            return message.errorMessage(err)
        }
        const emojiID = text.split(':')[2].replace(">", "");
        if (!emojiID) {
            const err = await message.translate("EMOJI_ERROR")
            return message.errorMessage(err)
        }
        const emoji = message.guild.emojis.cache.get(emojiID);
        if (emoji === undefined || !emoji.available || emoji.deleted) {
            const err = await message.translate("EMOJI_ERROR")
            return message.errorMessage(err)
        }
        try {
            await emoji.delete()
            const lang = await message.translate("DELETE_EMOJI")
            return message.succesMessage(lang)
        } catch (e) {
            if (message.client.log) console.log(e)
            let a = await message.translate("ERROR");
            const r = new Discord.MessageEmbed()
                .setColor("#F0B02F").setTitle(a.title).setDescription(a.desc).setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: !0, size: 512 }));
            return message.channel.send({ embeds: [r] })
        }
    },
};
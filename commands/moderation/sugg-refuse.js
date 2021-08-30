const Discord = require('discord.js');
const ms = require('ms');
const sugg = require('../../database/models/sugg');
module.exports = {
    name: 'sugg-refuse',
    description: 'Refuse une suggestion',
    aliases: ['refuse-sugg', 'refuse'],
    guildOnly: true,
    args: true,
    usage: '<id>',
    exemple: '447357094895550474 <reason>',
    cat: 'moderation',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
    async execute(message, args, client) {
        const lang = await message.translate("SUGGEST")
        if (!message.guild.settings.suggestions) return message.errorMessage(lang.notEnabled)
        else {
            const messageID = args[0];
            if (isNaN(messageID)) {
                return message.errorMessage(lang.noMessageID)
            }
            let reason = args.slice(1).join(" ");
            if (!reason) return message.errorMessage(lang.reasonRequired)
            let suggChannel = message.guild.channels.cache.get(message.guild.settings.suggestions)
            if (!suggChannel) return message.errorMessage(lang.err.replace('{channel}', `<#${message.guild.settings.suggestions}>`))
            let suggM = suggChannel.messages.fetch(messageID).then(async msg => {
                    if (msg.partial) await msg.fetch()
                    let findReal = await sugg.findOne({ serverID: message.guild.id, messageID: messageID })
                    if (!findReal) return message.errorMessage(lang.NOT_A_SUGG)
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(`❌ Suggestion ${lang.deniedBy} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                        .addField(lang.comment, `${reason.length > 500 ? reason.slice(0, 500) + '...':reason}`, true)
                        .addField(lang.field2, `<@${findReal.autorID}>`, true)
                        .setDescription(findReal.content)
                        .setFooter(`Green-bot - www.green-bot.app`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                        .setColor("#982318")
                        .setTimestamp();
                    msg.edit({ embeds: [embed] })
                    message.mainMessage(lang.deniedOK.replace("{url}", msg.url))
                    if (message.guild.memberCount !== message.guild.members.cache.size) await message.guild.members.fetch()
                    const user = message.guild.members.cache.get(findReal.autorID)
                    if (user) {
                        const dm = new Discord.MessageEmbed()
                            .setDescription(lang.refuseDM.replace("{url}", msg.url))
                            .setColor(message.guild.settings.color)
                        user.send({ embeds: [dm] })
                    }
                })
                .catch(err => {
                    if (message.client.log) console.log(err)
                    return message.errorMessage(lang.noMessageID)
                })
        }
    },
};
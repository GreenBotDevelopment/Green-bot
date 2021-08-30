const Discord = require('discord.js');
const guild = require('../../database/models/guild')
const guildData = require('../../database/models/guildData')
const Welcome = require('../../database/models/Welcome')

module.exports = {
    name: 'set-sugg',
    description: 'Configures the suggestions system',
    aliases: ['suggchannel', "sugg-channel", "setsugg"],
    cat: 'configuration',
    usages: [
        "set-sugg channel #channel",
        "set-sugg channel disable",
        "set-sugg logs #channel",
        "set-sugg logs disable"
    ],
    args: 'channel',
    guildOnly: true,
    usage: 'channel/logs #channel/disable',
    exemple: 'channel #sugg',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        if (args[0].toLowerCase() === "channel") {
            const lang = await message.translate("SET_SUGG")
            if (args[1].toLowerCase() === 'disable') {
                if (message.guild.settings.suggestions) {
                    message.guild.settings.suggestions = null
                    const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { suggestions: null } }, { new: true });
                    return message.succesMessage(lang.disable)
                } else {
                    let required = await message.translate("CONGIG_REQUIRED")
                    return message.errorMessage(required)
                }
            }
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
            if (!channel || channel.type !== 'GUILD_TEXT' || channel.guild.id !== message.guild.id) {
                let errorChannel = await message.translate("ERROR_CHANNEL")
                return message.errorMessage(errorChannel)

            }
            if (!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES') || !channel.permissionsFor(message.guild.me).has('EMBED_LINKS') || !channel.viewable) {
                let a = await message.translate("CHANNEL_PERMS")
                return message.errorMessage(a)
            }
            if (channel.id === message.guild.settings.suggestions) {
                return message.errorMessage(lang.already)
            }
            await channel.setRateLimitPerUser(60, "Suggestion system to prevent spam");
            const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { suggestions: channel.id } }, { new: true });
            message.guild.settings.suggestions = channel.id
            return message.succesMessage(lang.succes.replace("{channel}", channel.name))
        } else if (args[0] === "logs") {
            let lang = await message.translate("SUGG_LOGS")
            if (args[1] === 'disable') {
                const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `sugg_log` })
                if (verify) {
                    const newchannel = await Welcome.findOneAndDelete({ serverID: message.guild.id, reason: `sugg_log` });
                    return message.succesMessage(lang.disable)
                } else {
                    let required = await message.translate("CONGIG_REQUIRED")
                    return message.errorMessage(required)
                }
            }
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
            if (!channel || channel.type !== 'GUILD_TEXT' || channel.guild.id !== message.guild.id) {
                let errorChannel = await message.translate("ERROR_CHANNEL")
                return message.errorMessage(errorChannel)
            }
            if (!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES') || !channel.permissionsFor(message.guild.me).has('EMBED_LINKS') || !channel.viewable) {
                let a = await message.translate("CHANNEL_PERMS")
                return message.errorMessage(a)
            }
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `sugg_log` })
            if (verify) {
                const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `sugg_log` }, { $set: { channelID: channel.id, reason: `sugg_log` } }, { new: true });
                return message.succesMessage(lang.succes.replace("{channel}", channel.name))
            } else {
                const verynew = new Welcome({
                    serverID: `${message.guild.id}`,
                    channelID: `${channel.id}`,
                    reason: 'sugg_log',
                }).save();
                return message.succesMessage(lang.succes.replace("{channel}", channel.name))

            }

        } else {

            let err = await message.translate("ARGS_REQUIRED")

            const reportEmbed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

            .setDescription(`${err.replace("{command}","set-sugg")} \`${message.guild.settings.prefix}set-sugg channel/logs #channel/disable\``)

            .setFooter(message.client.footer)
                .setColor("#F0B02F")

            return message.channel.send({ embeds: [reportEmbed] })

        }



    },
};
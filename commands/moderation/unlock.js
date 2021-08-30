const Discord = require('discord.js');
module.exports = {
    name: 'unlock',
    description: 'déverouille un salon ou le salon actuel',
    aliases: ['unlockchannel', 'open', 'openchannel'],
    cat: 'moderation',
    permissions: ['MANAGE_CHANNELS'],
    botpermissions: ['MANAGE_CHANNELS'],
    async execute(message, args, client) {
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel && args.length) {
            let errorChannel = await message.translate("ERROR_CHANNEL")
            return message.errorMessage(errorChannel)
        } else if (!channel) {
            if (!message.channel.name.includes("🔒")) {
                let loadingTest = await message.translate("UNLOCK_ERROR")
                return message.errorMessage(loadingTest)
            }
            message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SEND_MESSAGES: true,
                ADD_REACTIONS: true,
            }).then(async g => {
                g.edit({
                    name: g.name.replace(/\s*🔒/, '')
                })
                let loadingTest = await message.translate("UNLOCK")
                g.send({ embeds: [new Discord.MessageEmbed().setColor("#F0B02F").setDescription(`**${loadingTest}**`)] })

            })
        } else {
            if (!channel.name.includes("🔒")) {
                let loadingTest = await message.translate("UNLOCK_ERROR")
                return message.errorMessage(loadingTest)
            }
            channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SEND_MESSAGES: true,
                ADD_REACTIONS: true,
            }).then(async g => {
                g.edit({
                    name: g.name.replace(/\s*🔒/, '')
                })
                let loadingTest = await message.translate("UNLOCK")
                g.send({ embeds: [new Discord.MessageEmbed().setColor("#F0B02F").setDescription(`**${loadingTest}**`)] })
            })
        }
    },
};
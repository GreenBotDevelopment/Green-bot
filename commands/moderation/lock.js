const Discord = require('discord.js');
const { args } = require('../level/addlevel');
module.exports = {
    name: 'lock',
    description: 'Verrouille un salon ou le salon actuel',
    aliases: ['lockchannel', 'close', 'closechannel'],
    cat: 'moderation',
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS"],

    permissions: ['MANAGE_CHANNELS'],
    async execute(message, client) {

        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel && args.length) {
            let errorChannel = await message.translate("ERROR_CHANNEL")
            return message.errorMessage(errorChannel)
        } else if (!channel) {

            if (message.channel.name.includes("🔒")) {
                let loadingTest = await message.translate("LOCK_ERROR")
                return message.errorMessage(loadingTest)
            }
            if (!message.channel.permissionsFor(message.guild.me).has('MANAGE_CHANNELS')) {
                let a = await message.translate("CHANNEL_PERMS")
                message.errorMessage(a)
            }
            message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
            }).then(async g => {
                g.edit({
                    name: '🔒' + g.name
                })
                let loadingTest = await message.translate("LOCK")

                g.send({ embeds: [new Discord.MessageEmbed().setColor("#F0B02F").setDescription(loadingTest)] })

            })
        } else {

            if (channel.name.includes("🔒")) {
                let loadingTest = await message.translate("LOCK_ERROR")
                return message.errorMessage(loadingTest)
            }
            if (!channel.permissionsFor(message.guild.me).has('MANAGE_CHANNELS')) {
                let a = await message.translate("CHANNEL_PERMS")
                message.errorMessage(a)
            }

            channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
            }).then(async g => {
                g.edit({
                    name: '🔒' + g.name
                })
                let loadingTest = await message.translate("LOCK")

                g.send({ embeds: [new Discord.MessageEmbed().setColor("#F0B02F").setDescription(loadingTest)] })

            })
        }






    },
};
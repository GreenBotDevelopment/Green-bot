const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome');
const premiumDB = require('../../database/models/premium');

module.exports = {
    name: 'volume',
    description: 'Changer le volume du bot dans le salon vocal',
    permissions: false,
    aliases: ['sound', 'v'],
    cat: 'music',
    args: true,

    usage: '<number>',
    exemple: '70',
    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args) {

        if (message.guild.settings.dj_system) {
            if (!message.member.permissions.has("MANAGE_MESSAGES")) {
                let MissingRole = await message.translate("MISSING_ROLE");
                let Missingperm = await message.translate("MISSING_PERMISSIONS");
                let role = message.guild.roles.cache.get(message.guild.settings.dj_system)
                if (!role) return message.errorMessage(Missingperm.replace("{perm}", 'MANAGE_MESSAGES'))
                if (message.member.roles.cache) {
                    if (!message.member.roles.cache.has(role.id)) {
                        return message.errorMessage(MissingRole.replace("{perm}", 'MANAGE_MESSAGES').replace("{role}", role))
                    }
                } else {
                    return message.errorMessage(MissingRole.replace("{perm}", 'MANAGE_MESSAGES').replace("{role}", role))
                }
            }
        }

        const voice = message.member.voice.channel;
        if (!voice) {
            let err = await message.translate("NOT_VOC")
            return message.errorMessage(err)
        }
        if (!message.client.player.getQueue(message.guild.id) || !message.client.player.getQueue(message.guild.id).playing) {
            let err = await message.translate("NOT_MUSIC")
            return message.errorMessage(err)

        }

        if (isNaN(args[0]) || 200 < parseInt(args[0]) || parseInt(args[0]) <= 0) {
            let numberErr = await message.translate("NUMBER_ERROR")
            return message.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "200"))
        }

        if (message.content.includes('-') || message.content.includes('+') || message.content.includes(',') || message.content.includes('.')) {
            let numberErr = await message.translate("NUMBER_ERROR")
            return message.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "200"))
        }
        const queue = message.client.player.getQueue(message.guild.id);
        queue.setVolume(parseInt(args[0]));
        let a = await message.translate("VOLUME")
        message.mainMessageT(a.replace("{volume}", args[0]))

    },
};
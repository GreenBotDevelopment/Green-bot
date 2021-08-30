const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome');

module.exports = {
    name: 'shuffle',
    description: 'Mélange la queue du serveur',
    permissions: false,
    aliases: ['shufle'],
    cat: 'music',
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

        const queue = message.client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing) {
            let err = await message.translate("NOT_MUSIC")
            return message.errorMessage(err)

        }
        const lang = await message.translate("CLEAR_QUEUE")
        if (message.client.player.getQueue(message.guild.id).tracks.length <= 1) return message.errorMessage(lang.err);
        let a = await message.translate("SHUFFLE")

        queue.shuffle();
        message.mainMessageT(a.replace("{x}", queue.tracks.length))







    },
};
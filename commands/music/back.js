module.exports = {
    name: 'back',
    description: 'Joue la musique précédente',
    cat: 'music',
    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args, client, guildDB) {
        const voice = message.member.voice.channel;
        if (!voice) {
            let err = await message.translate("NOT_VOC", guildDB.lang)
            return message.errorMessage(err)
        }
        const queue = message.client.player.getQueue(message.guild.id)
        if (!queue || !queue.playing) {
            let err = await message.translate("NOT_MUSIC", guildDB.lang)
            return message.errorMessage(err)
        }

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
            let err = await message.translate("NOT_SAME_CHANNEL", guildDB.lang)
            return message.errorMessage(err);
        }
        if (guildDB.dj_role && queue.metadata.dj.id !== message.author.id) {
            if (!message.member.permissions.has("MANAGE_MESSAGES")) {
                let MissingRole = await message.translate("MISSING_ROLE", guildDB.lang);
                let Missingperm = await message.translate("MISSING_PERMISSIONS", guildDB.lang);
                let role = message.guild.roles.cache.get(guildDB.dj_role)
                if (!role) return message.errorMessage(Missingperm.replace("{perm}", 'Manage messages'))
                if (message.member.roles.cache) {
                    if (!message.member.roles.cache.has(role.id)) return message.errorMessage(MissingRole.replace("{perm}", 'Manage messages').replace("{role}", role.name))
                } else return message.errorMessage(MissingRole.replace("{perm}", 'Manage messages').replace("{role}", role.name))
            }
        }
        const lang = await message.translate("BACK", guildDB.lang)
        if (!queue.previousTracks[0] || queue.previousTracks.length == 0) return message.errorMessage(lang.err)
        if (queue.previousTracks.length > 1) {
            const backed = queue.back();
            if (backed) {
                message.channel.send(lang.ok)
            } else {
                return message.errorMessage(lang.err)
            }
        } else {
            return message.errorMessage(lang.err)
        }
    },
};
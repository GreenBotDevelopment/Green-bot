module.exports = {
    name: 'resume',
    description: 'Resumes the music',
    cat: 'music',
    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args, client, guildDB) {
        const voice = message.member.voice.channel;
        if (!voice) {
            return message.errorMessage(message.translate("NOT_VOC", guildDB.lang))
        }
        const queue = message.client.player.getQueue(message.guild.id)
        if (!queue || !queue.playing) {
            return message.errorMessage(message.translate("NOT_MUSIC", guildDB.lang))
        }
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
            return message.errorMessage(message.translate("NOT_SAME_CHANNEL", guildDB.lang));
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
        const lang = await message.translate("RESUME", guildDB.lang)
        if (!queue.connection.paused) return message.errorMessage(lang.err)
        queue.setPaused(false);
        message.succesMessage(lang.ok);
    },
};
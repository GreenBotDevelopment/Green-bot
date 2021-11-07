module.exports = {
    name: 'movebot',
    description: 'Moves the bot to you current voc channel.',
    cat: 'music',
    aliases: ['move'],
    permissions: ["MANAGE_MESSAGES"],
    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args, client, guildDB) {
        const voice = message.member.voice.channel;
        if (!voice) {
            let err = await message.translate("NOT_VOC", guildDB.lang)
            return message.errorMessage(err)
        }
        if (voice && guildDB.vc && guildDB.vc !== message.member.voice.channel.id && message.guild.channels.cache.get(guildDB.vc)) {
            let err = await message.translate("NOT_GOOD_VOC", guildDB.lang)
            return message.errorMessage(err.replace("{channel}", message.guild.channels.cache.get(guildDB.vc)))
        }
        const moved = await message.translate("MOVED", guildDB.lang)
        if (message.guild.me.voice.channel && message.member.voice.channel.id === message.guild.me.voice.channel.id) {
            return message.errorMessage(moved.already);
        }
        const queue = message.client.player.getQueue(message.guild.id);
        if (!queue) {
            let err = await message.translate("NOT_MUSIC", guildDB.lang)
            return message.errorMessage(err)
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
        message.guild.me.voice.setChannel(voice, `Move command`)
        return message.succesMessage(moved.ok.replace("{channel}", message.member.voice.channel))
    },
};
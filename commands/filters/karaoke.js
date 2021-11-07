module.exports = {
    name: 'karaoke',
    description: 'Toggles karaoke filter',
    cat: 'filters',
    exemple: 'enable',
    Rpremium: true,
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
        const lang = await message.translate("KARAOKE", guildDB.lang)
        if (!queue.getFiltersEnabled().includes("karaoke")) {
            await queue.setFilters({
                karaoke: true,
                normalizer2: true // because we need to toggle it with bass
            });
            return message.succesMessage(lang.enabled, true);
        } else {
            await queue.setFilters({
                karaoke: false,
                normalizer2: false, // because we need to toggle it with bass
            });
            return message.succesMessage(lang.disabled, true);
        };
    },
};
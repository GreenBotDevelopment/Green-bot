const { QueueRepeatMode } = require("discord-player");
module.exports = {
    name: 'loop',
    description: 'Active /désactive la répetition',
    cat: 'music',
    exemple: 'queue',
    args: true,
    premium: true,
    usages: ["loop queue", "loop song", ],
    usage: 'queue/song',
    aliases: ['lp', 'repeat'],
    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args, client, guildDB, cmd) {
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
        if (queue.connection.paused) return message.errorMessage("The music is currently paused. Please unpause it before")
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
        let lang = await message.translate("LOOP", guildDB.lang)
        let ena = await message.translate("DISABLED/ENABLED", guildDB.lang)
        if (args.join(" ").toLowerCase() === 'queue' || args.join(" ").toLowerCase() === 'q' || args.join(" ").toLowerCase() === 'all') {
            if (queue.repeatMode) {
                queue.setRepeatMode(QueueRepeatMode.OFF);
                return message.succesMessage(lang.queue.replace("{status}", ena.disable));
            } else {
                queue.setRepeatMode(QueueRepeatMode.QUEUE);
                return message.succesMessage(lang.queue.replace("{status}", ena.enabled));
            };
        } else if (args.join(" ").toLowerCase() === 'song' || args.join(" ").toLowerCase() === 'current') {
            if (queue.repeatMode) {
                queue.setRepeatMode(QueueRepeatMode.OFF);
                return message.succesMessage(lang.music.replace("{status}", ena.disable));
            } else {
                queue.setRepeatMode(QueueRepeatMode.TRACK);
                return message.succesMessage(lang.music.replace("{status}", ena.enabled));
            };
        } else return message.usage(guildDB, cmd)

    },
};
const { QueueRepeatMode } = require("discord-player");
module.exports = {
    name: 'skip',
    description: 'Skip the currently playing song if there is one',
    cat: 'music',
    aliases: ["next", 's'],

    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args, client, guildDB) {
        const voice = message.member.voice.channel;
        if (!voice) {
            let err = await message.translate("NOT_VOC", guildDB.lang)
            return message.errorMessage(err)
        }
        const queue = message.client.player.getQueue(message.guild.id);
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
        if (queue.tracks.length == 0 && queue.repeatMode !== QueueRepeatMode.AUTOPLAY) return message.errorMessage("Nothing next in the queue. Use `" + guildDB.prefix + "queue` to see the server's queue.\nWant to try autoplay? `" + guildDB.prefix + "autoplay`")
        const success = queue.skip();
        if (success) {
            let a = await message.translate("SKIP", guildDB.lang)
            message.channel.send(a)
        } else return message.errorMessage("Nothing next in the queue.")

    },
};
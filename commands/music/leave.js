module.exports = {
    name: 'leave',
    description: 'Makes the bot leaving your voice channel.',
    cat: 'music',
    aliases: ["disconnect", "dc"],
    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args, client, guildDB) {
        let queue = message.client.player.getQueue(message.guild.id)
        if (!queue || !queue.connection || !message.guild.me.voice.channel) {
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
        try {
            if (queue.connection) await queue.connection.disconnect()
        } catch (err) {
            console.log(err)
            return message.errorMessage(`I am not able to leave your voice channel, please check my permissions !`);
        }
        if (message.guild.me.voice.channel) await queue.connection.disconnect()
        message.succesMessage("Disconnected from <#" + message.guild.me.voice.channel.id + ">.")
    },
};
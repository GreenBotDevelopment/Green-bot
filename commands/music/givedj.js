module.exports = {
    name: 'givedj',
    description: 'Transfer the dj of the queue.',
    cat: 'music',
    args: true,

    usage: "@user",
    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args, client, guildDB) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.toLowerCase().includes(args[0].toLowerCase()) || m.displayName.toLowerCase().includes(args[0].toLowerCase()) || m.user.username.toLowerCase().includes(args[0].toLowerCase())).first()
        if (!member || member.user.bot) {
            let err = await message.translate("ERROR_USER", guildDB.lang)
            return message.errorMessage(err)
        }
        const queue = message.client.player.getQueue(message.guild.id);
        if (!queue || !queue.playing) {
            let err = await message.translate("NOT_MUSIC", guildDB.lang)
            return message.errorMessage(err)
        }
        if (member.id === queue.metadata.dj.id) return message.errorMessage(`**${member.user.username}** is already DJ !`)
        if (queue.metadata.dj.id !== message.author.id) return message.errorMessage("You are not the dj in the queue")
        queue.metadata.dj = member.user
        message.succesMessage(`<@${member.id}> is now dj of the current queue.`)
    },
};
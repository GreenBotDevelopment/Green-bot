module.exports = {
    name: 'volume',
    description: 'Changes the Volume',
    permissions: false,
    aliases: ['sound', 'v', "vol"],
    cat: 'music',
    args: true,
    usage: '<number>',
    premium: true,
    exemple: '70',
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
        let volume = args[0]
        if (volume.startsWith("<")) return message.errorMessage("Hooks such as `[]` or `<>` must not be used when executing commands. Ex: `" + guildDB.prefix + "volume 100`")
        if (args[0] === "max") volume = 200
        if (args[0] === "reset" || args[0] === "default") volume = 70
        if (isNaN(volume) || 200 < parseInt(volume) || parseInt(volume) <= 0) {
            let numberErr = await message.translate("NUMBER_ERROR", guildDB.lang)
            return message.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "200"))
        }
        if (message.content.includes('-') || message.content.includes('+') || message.content.includes(',') || message.content.includes('.')) {
            let numberErr = await message.translate("NUMBER_ERROR", guildDB.lang)
            return message.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "200"))
        }
        queue.connection.setVolume(parseInt(volume));
        let a = await message.translate("VOLUME", guildDB.lang)
        message.succesMessage(a.replace("{volume}", volume))
    },
};
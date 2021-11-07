module.exports = {
    name: 'defaultVolume',
    description: 'Sets the default volume',
    permissions: false,
    aliases: ['defaultvolume'],
    cat: 'configuration',
    args: true,
    usage: '<number>',
    premium: true,
    exemple: '70',
    permissions: ["MANAGE_GUILD"],
    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args, client, guildDB) {
        let volume = args[0];
        if (isNaN(volume) || 200 < parseInt(volume) || parseInt(volume) <= 0) {
            let numberErr = await message.translate("NUMBER_ERROR", guildDB.lang)
            return message.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "200"))
        }
        if (message.content.includes('-') || message.content.includes('+') || message.content.includes(',') || message.content.includes('.')) {
            let numberErr = await message.translate("NUMBER_ERROR", guildDB.lang)
            return message.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "200"))
        }
        guildDB.defaultVolume = volume;
        guildDB.save()
        let a = await message.translate("DEFAULT_VOLUME", guildDB.lang)
        message.succesMessage(a.replace("{volume}", volume))
        if (volume < 20) {
            let a = await message.translate("DEFAULT_VOLUME_WARNING", guildDB.lang)
            message.mainMessage(a.replace("{volume}", volume))
        }
    },
};
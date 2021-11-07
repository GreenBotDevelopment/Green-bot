module.exports = {
    name: 'setvc',
    description: 'Restricts the bot to a specific voice channel',
    cat: 'configuration',
    args: 'channel',
    usage: '#channel/disable',
    usages: ["setvc #channel", "setvc disable"],
    exemple: 'voice',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args, client, guildDB) {
        const lang = await message.translate("SETVC", guildDB.lang)
        if (args[0] === 'disable') {
            if (guildDB.vc) {
                guildDB.vc = null;
                guildDB.save();
                return message.succesMessage(lang.disable)
            } else {
                let required = await message.translate("CONGIG_REQUIRED", guildDB.lang)
                return message.errorMessage(required)
            }
        }
        let a = args.join(" ")
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.filter(c => c.name.toLowerCase().includes(a.toLowerCase())).first();
        if (!channel || channel.type !== 'GUILD_VOICE' || channel.guild.id !== message.guild.id) {
            let errorChannel = await message.translate("ERROR_CHANNEL_VOICE", guildDB.lang)
            return message.errorMessage(errorChannel)
        }
        if (guildDB.vc && guildDB.vc === channel.id) {
            return message.errorMessage(lang.already)
        }
        guildDB.vc = channel.id;
        guildDB.save()
        return message.succesMessage(lang.succes.replace("{channel}", channel))
    },
};
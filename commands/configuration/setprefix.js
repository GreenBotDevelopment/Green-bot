const guildData = require('../../database/models/guildData');
module.exports = {
    name: 'setprefix',
    description: 'Change le préfixe du bot',
    usage: '<prefix>',
    args: true,
    cat: 'configuration',
    exemple: '!',
    cooldown: 15,
    aliases: ["prefix"],
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        const lang = await message.translate("SET_PREFIX")
        let prefix = args.join("")
        if (prefix.length > 4 || prefix.length < 0 || prefix.search(/[.?[\]\\/<>\-=+*^$!]/g) === -1) return message.errorMessage(lang.err);
        if (prefix === message.guild.settings.prefix) return message.errorMessage(lang.already)
        const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id, }, { $set: { prefix: args[0] } }, { new: true });
        message.guild.settings.prefix = args[0]
        return message.succesMessage(lang.ok.replace("{prefix}", args[0]).replace("{prefix}", args[0]))
    },
};
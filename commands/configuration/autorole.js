const guildData = require('../../database/models/guildData');
module.exports = {
    name: 'autorole',
    description: 'Défini le role donné automatiquement au nouveaux membres',
    aliases: ["setautorole"],
    cat: 'configuration',
    args: true,
    guildOnly: true,
    usage: '@role/disable',
    usages: ["autorole @role", "autorole disable"],
    exemple: '@user',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        let lang = await message.translate("AUTOROLE")
        if (args[0].toLowerCase() === 'disable') {
            if (message.guild.settings.autorole) {
                message.guild.settings.autorole = null
                const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { autorole: null } }, { new: true });
                return message.succesMessage(lang.disable)
            } else {
                let required = await message.translate("CONGIG_REQUIRED")
                return message.errorMessage(required)
            }
        }
        const a = args.join(" ")

        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.filter(m => m.name.toLowerCase().includes(a.toLowerCase())).first()
        if (!role || role.name === '@everyone' || role.managed) {
            let err = await message.translate("ERROR_ROLE")
            return message.errorMessage(err);
        }
        if (message.guild.me.roles.highest.comparePositionTo(role) < 0) {
            const lange = await message.translate("ROLEREACT")
            return message.errorMessage(lange.position);
        }
        const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { autorole: role.id } }, { new: true });
        message.guild.settings.autorole = role.id
        return message.succesMessage(lang.succes.replace("{role}", role.name))
    },
};
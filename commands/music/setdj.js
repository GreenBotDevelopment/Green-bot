module.exports = {
    name: 'setdj',
    description: 'Setups the dj role',
    aliases: ["dj-system"],
    cat: 'configuration',
    args: true,
    premium: true,
    usage: '@role/disable',
    usages: ["setdj @role", "setdj disable"],
    exemple: '@user',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ['MANAGE_ROLES'],
    async execute(message, args, client, guildDB) {
        let lang = await message.translate("DJMODE", guildDB.lang)
        if (args[0].toLowerCase() === 'disable') {
            if (guildDB.dj_role) {
                guildDB.dj_role = null
                guildDB.save()
                return message.succesMessage(lang.disable)
            } else {
                let required = await message.translate("CONGIG_REQUIRED", guildDB.lang)
                return message.errorMessage(required)
            }
        }
        const a = args.join(" ")
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.filter(m => m.name.toLowerCase().includes(a.toLowerCase())).first()
        if (!role || role.name === '@everyone' || role.managed) {
            let err = await message.translate("ERROR_ROLE", guildDB.lang)
            return message.errorMessage(err);
        }
        guildDB.dj_role = role.id
        guildDB.save()
        return message.succesMessage(lang.succes.replace("{role}", role.name))
    },
};
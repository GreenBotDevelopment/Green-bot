module.exports = {
    name: 'toggle-np',
    description: 'This will enable/disable now-playing aka song announcing',
    cat: 'configuration',
    exemple: 'enable',
    Rpremium: true,
    aliases: ['announcesongs', "announce"],
    permissions: ["MANAGE_GUILD"],
    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args, client, guildDB, cmd) {
        const lang = await message.translate("ANNOUNCE", guildDB.lang)
        if (!guildDB.announce) {
            guildDB.announce = true
            guildDB.save()
            return message.succesMessage(lang.enabled);
        } else {
            guildDB.announce = null
            guildDB.save()
            return message.succesMessage(lang.disabled);
        };
    },
};
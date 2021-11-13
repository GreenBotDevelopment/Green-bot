module.exports = {
    name: '24/7',
    description: 'Enable/Disable The 24h/7 mode',
    cat: 'configuration',
    exemple: 'on',
    premium: true,
    permissions: ["MANAGE_GUILD"],
    aliases: ['247'],
    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args, client, guildDB) {
        const lang = await message.translate("24/7", guildDB.lang)
        if (!guildDB.h24) {
            guildDB.h24 = true;
            guildDB.save();
            message.succesMessage(lang.enabled, true);
        } else {
            guildDB.h24 = null;
            guildDB.save();
            message.succesMessage(lang.disabled, true);
        };
    },
};

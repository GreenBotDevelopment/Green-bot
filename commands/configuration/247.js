const guildData = require('../../database/models/guildData');
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
            /*    const findSchema = await voiceSchema.findOne({ serverID: message.guild.id });
                if (findSchema) {
                    findSchema.channelID = message.member.voice.id;
                    findSchema.save();
                } else {
                    const newSchema = new voiceSchema({
                        serverID: message.guild.id,
                        channelID: message.member.voice.id
                    })
                    newSchema.save();
                }
                */
        } else {
            guildDB.h24 = null;
            guildDB.save();
            message.succesMessage(lang.disabled, true);
            /*  const findSchema = await voiceSchema.findOne({ serverID: message.guild.id });
             if (findSchema) {
                 findSchema.channelID = null;
                 findSchema.save();
             }
             */
        };
    },
};
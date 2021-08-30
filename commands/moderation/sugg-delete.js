const sugg = require('../../database/models/sugg');
module.exports = {
    name: 'sugg-delete',
    description: 'Accepte une suggestion',
    aliases: ['delete-sugg', 'delete'],
    guildOnly: true,
    args: true,
    usage: '<id>',
    exemple: '447357094895550474',
    cat: 'moderation',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
    async execute(message, args, client) {
        const lang = await message.translate("SUGGEST")
        if (!message.guild.settings.suggestions) return message.errorMessage(lang.notEnabled)
        else {
            const messageID = args[0];
            let suggChannel = message.guild.channels.cache.get(message.guild.settings.suggestions)
            if (!suggChannel) return message.errorMessage(lang.err.replace('{channel}', `<#${message.guild.settings.suggestions}>`))
            let suggM = suggChannel.messages.fetch(messageID).then(async msg => {
                    if (msg.partial) await msg.fetch()
                    let findReal = await sugg.findOne({ serverID: message.guild.id, messageID: messageID })
                    if (!findReal) return message.errorMessage(lang.NOT_A_SUGG)
                    msg.delete()
                    message.succesMessage(lang.delete)
                })
                .catch(err => {
                    if (!suggM) return message.errorMessage(lang.noMessageID)
                })
        }
    },
};
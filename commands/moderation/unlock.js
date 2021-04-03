const Discord = require('discord.js');
module.exports = {
    name: 'unlock',
    description: 'déverouille un salon ou le salon actuel',
    aliases: ['unlockchannel', 'open', 'openchannel'],
    cat: 'moderation',
    permissions: ['MANAGE_CHANNELS'],
    botpermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_CHANNELS'],

    execute(message, client) {

        if (!client.lockit) client.lockit = [];

        message.channel.updateOverwrite(message.guild.roles.everyone, {
            SEND_MESSAGES: null
        }).then(g => {
            g.edit({
                name: g.name.replace(/\s*🔒/, '')
            })
            g.send(`🔓 | Salon déverrouillé avec succès`)
        })
    },
};

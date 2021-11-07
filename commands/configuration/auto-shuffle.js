module.exports = {
    name: 'autoshuffle',
    description: 'If you want to shuffle automatically spotify/youtube playlists',
    cat: 'configuration',
    exemple: 'enable',
    premium: true,
    args: true,
    permissions: ["MANAGE_GUILD"],
    usages: ["autoshuffle enable", "autoshuffle disable"],
    aliases: ['autoshuffle'],
    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args, client, guildDB, cmd) {
        const lang = await message.translate("autoshuffle", guildDB.lang)
        if (args.join(" ").toLowerCase() === 'enable') {
            if (!guildDB.auto_shuffle) {
                guildDB.auto_shuffle = true;
                guildDB.save();
                message.succesMessage(lang.enabled);
                if (client.player.getQueue(message.guild.id)) client.player.getQueue(message.guild.id).metadata.guildDB.auto_shuffle = true
            } else {
                return message.errorMessage(lang.enabledSince);
            };
        } else if (args.join(" ").toLowerCase() === 'disable') {
            if (guildDB.auto_shuffle) {
                guildDB.auto_shuffle = null;
                guildDB.save();
                message.succesMessage(lang.disabled);
                if (client.player.getQueue(message.guild.id)) client.player.getQueue(message.guild.id).metadata.guildDB.auto_shuffle = null
            } else {
                return message.errorMessage(lang.disabledSince);
            };
        } else {
            return message.usage(guildDB, cmd)

        }
    },
};
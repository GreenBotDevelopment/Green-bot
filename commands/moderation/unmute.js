const Discord = require('discord.js');
const ms = require('ms');
module.exports = {
    name: 'unmute',
    description: 'Met fin au mute d\'un membre',
    guildOnly: true,
    args: true,
    usage: '@user',
    exemple: '@pauldb09',
    cat: 'moderation',
    permissions: ['MANAGE_ROLES'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_ROLES"],
    async execute(message, args, client) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.toLowerCase().includes(args[0].toLowerCase()) || m.displayName.toLowerCase().includes(args[0].toLowerCase()) || m.user.username.toLowerCase().includes(args[0].toLowerCase())).first()
        if (!user) {
            let err = await message.translate("ERROR_USER")
            return message.errorMessage(err)
        }
        const lang = await message.translate("UNMUTE")
        let role = message.guild.roles.cache.find(role => role.name === "Muted");
        if (!role) {
            return message.errorMessage(lang.err);
        }
        if (user.roles.cache) {
            if (!user.roles.cache.has(role.id)) {
                return message.errorMessage(lang.err);
            }
        } else {
            return message.errorMessage(lang.err);
        }
        try {
            user.roles.remove(role)
            message.succesMessage(lang.ok.replace("{user}", user.user.tag));
        } catch (err) {
            message.succesMessage(lang.warn.replace("{user}", user.user.tag));
        }
    },
};
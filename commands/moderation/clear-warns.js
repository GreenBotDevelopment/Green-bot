const Discord = require('discord.js');
const Warn = require('../../database/models/warn');
module.exports = {
    name: 'clear-warns',
    description: 'Enlève tous les warn d\'un utilisateur',
    aliases: ["unwarn"],
    guildOnly: true,
    args: 'user',
    usage: '@user',
    exemple: '@pauldb09',
    cat: 'moderation',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],


    async execute(message, args, client) {

        let tran = await message.translate("UNWARN");

        const modErr = await message.translate("MODERATION")

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.toLowerCase().includes(args[0].toLowerCase()) || m.displayName.toLowerCase().includes(args[0].toLowerCase()) || m.user.username.toLowerCase().includes(args[0].toLowerCase())).first()
        if (!member) {
            let err = await message.translate("ERROR_USER")
            return message.errorMessage(err)
        }

        if (member.user.bot) {
            let err = await message.translate("ERROR_BOT")
            return message.errorMessage(err)
        }


        if (member.id === message.guild.OWNER) return message.errorMessage(modErr.owner)

        const memberPosition = member.roles.highest.position;
        const moderationPosition = message.member.roles.highest.position;
        if (message.guild.OWNER !== message.author.id && !(moderationPosition > memberPosition)) {
            return message.errorMessage(modErr.superior)
        }

        let warndb = await Warn.find({ serverID: message.guild.id, manID: member.id })
        if (warndb.length == 0) {
            return message.errorMessage(tran.err.replace("{username}", member.user.username))
        } else {
            message.succesMessage(tran.succes.replace("{username}", member.user.username))
            warndb.forEach(async wInfo => {
                const rr = await Warn.findOneAndDelete({ serverID: message.guild.id, manID: member.user.id, _id: wInfo._id })
            })
        }







    },
};
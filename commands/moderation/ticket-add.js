const Discord = require('discord.js');
const ms = require('ms');
const guild = require('../../database/models/guild');
const math = require('mathjs');
var db = require('quick.db')
module.exports = {
    name: 'ticket-add',
    description: 'Ajoute une personne à un ticket',

    guildOnly: true,
    aliases: ["add-ticket"],
    usage: '@user',
    exemple: '@pauldb09',
    cat: 'moderation',
    args: true,
    permission: ['MANAGE_MESSAGES'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS"],
    async execute(message, args, client) {
        const lang = await message.translate("TICKET_ADD")
        if (!message.channel.name.startsWith(`ticket-`)) return message.errorMessage(lang.noTicket)
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.includes(args.join(" ")) || m.displayName.includes(args.join(" ")) || m.user.username.includes(args.join(" "))).first()
        if (!member) {
            let err = await message.translate("ERROR_USER")
            return message.errorMessage(err)
        }
        if (member.permissions.has('ADMINISTRATOR')) return message.errorMessage(lang.already)
        if (message.author.id === db.get(`ticket.${message.channel.name}.user`)) {
            let Missingperm = await message.translate("MISSING_PERMISSIONS");
            return message.errorMessage(Missingperm.replace("{perm}", 'MANAGE_MESSAGES'))
        } else {
            let permsToHave = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS']

            message.channel.permissionOverwrites.create(member.id, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                READ_MESSAGE_HISTORY: true,
                ADD_REACTIONS: true,
            })
            message.succesMessage(lang.ok.replace("{username}", member.user.username))




        }





    },
};
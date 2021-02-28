const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const Welcome = require('../../database/models/Welcome')

const ms = require('ms');
module.exports = {
    name: 't-blacklist',
    description: 'Blackliste une personne du système de ticket et cette personne ne pourra plus ouvrir de tickets sur le serveur.',
    aliases: ['blacklist-ticket', 'ticket-blacklist'],
    guildOnly: true,
    args: true,
    usage: '<id>',
    exemple: '447357094895550474',
    cat: 'moderation',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
    async execute(message, args, client) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.includes(args.join(" ")) || m.displayName.includes(args.join(" ")) || m.user.username.includes(args.join(" "))).first()
        if (!member) {
            return message.errorMessage(`Vous devez mentionner un membre valide ou fournir un ID valide.`)
        }

        const verify = await Welcome.findOne({ serverID: message.guild.id, channelID: member.user.id, reason: `ticket_black` })
        if (verify) {

            return message.errorMessage(`**${member.user.username}** est déja blacklisté du système de tickets , ne vous acharnez pas trop contre lui :joy:.`);

        } else {
            const verynew = new Welcome({
                serverID: `${message.guild.id}`,
                channelID: `${member.user.id}`,
                reason: 'ticket_black',
            }).save();
            return message.succesMessage(`\`${member.user.tag}\` est désormais blacklisté du système de tickets , il ne pourra plus ouvrir de tickets .`)

        }


    },
};
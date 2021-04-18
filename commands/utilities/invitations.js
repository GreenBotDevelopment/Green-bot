const Discord = require('discord.js');
const emoji = require('../../emojis.json')
module.exports = {
    name: 'invitations',
    description: 'Regarde les invitations',
    botpermissions: ['MANAGE_GUILD'],
    cat: 'utilities',

    async execute(message, args) {


        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.includes(args.join(" ")) || m.displayName.includes(args.join(" ")) || m.user.username.includes(args.join(" "))).first()
        if (!member && args.lenght) {
            return message.errorMessage(`Vous devez mentionner un membre valide ou fournir un ID valide.`)
        } else {
            member = message.member
        }

        const invites = await message.guild.fetchInvites().catch(() => {});

        const memberInvites = invites.filter((i) => i.inviter && i.inviter.id === member.user.id);

        if (memberInvites.size <= 0) {
            if (member === message.member) {
                return message.errorMessage(`Vous n'avez aucunnes invitations sur ce serveur`)
            } else {
                return message.errorMessage(`Cette personne n'a pas d'invitations sur ce serveur`)
            }
        }


        let index = 0;
        memberInvites.forEach((invite) => index += invite.uses);

        const embed = new Discord.MessageEmbed()
            .setColor(message.client.color)
            .setFooter(message.client.footer)
            .setAuthor('INVITE TRACKER')
            .setDescription(`Invitations de ${member.user.tag}`)
            .addField('Membres invités :', index || '0')
            .addField('Codes', memberInvites.map(i => `**${i.code}**(${i.uses} Utilisations) | ${i.channel.toString()}`).join(`
            `));

        message.channel.send(embed);
    },
};
const Discord = require('discord.js');
const emoji = require('../../emojis.json')
module.exports = {
    name: 'checkinvite',
    description: 'Regarde qui a une invitation dans son statut parmi les membres du serveur',
    aliases: ["checkinvite", "checki"],
    cat: 'moderation',
    permissions: ['MANAGE_GUILD'],
    execute(message, client) {

        const members = message.guild.members;

        const withInvite = [];
        members.cache.forEach((m) => {
            const possibleLinks = m.user.presence.activities.map((a) => [a.state, a.details, a.name]).flat();
            const inviteLinks = possibleLinks.filter((l) => /(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(l));
            if (inviteLinks.length > 0) {
                withInvite.push({
                    id: m.user.id,
                    tag: Discord.Util.escapeMarkdown(m.user.tag),
                    links: "**" + Discord.Util.escapeMarkdown(inviteLinks.join(", ")) + "**"
                });
            }
        });

        const text = (withInvite.length > 0 ?
            withInvite.map((m) => "`" + m.id + "` (" + m.tag + ") : " + m.links).join("\n") :
            ` ${emoji.succes} Personne n'a d'invitation dans son statut !`);

        const embed = new Discord.MessageEmbed()
            .setTitle('Personnes qui ont des invitations dans leur statut')
            .setDescription(text)
            .setColor(message.client.color)
            .setFooter(message.client.footer);

        message.channel.send(embed);

    },
};
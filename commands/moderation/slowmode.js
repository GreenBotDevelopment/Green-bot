const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const { oneLine, stripIndent } = require('common-tags');
module.exports = {
    name: 'slowmode',
    description: oneLine `
    Active le mode lent dans un salon avec le taux spécifié.
    Si aucun salon n'est fourni, le mode lent affectera le salon actuel.
    Fournissez un taux de 0 pour désactiver.      `,
    aliases: ['banmember', 'bannir'],
    guildOnly: true,
    args: true,
    usage: 'nombre',
    exemple: '10',
    cat: 'moderation',
    botpermissions: ['SEND_MESSAGES', 'MANAGE_CHANNELS'],
    permissions: ['MANAGE_CHANNELS'],
    async execute(message, args, client) {

        let index = 1;
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel) {
            channel = message.channel;
            index--;
        }

        if (!channel || channel.type != 'text' || !channel.viewable) {
            return message.channel.send(`${emoji.error} Le salon fourni n'est pas un salon valide , il n'est pas visible pas le bot ou pas du bon type... `);
        }

        const rate = args[index];
        if (!rate || rate < 0 || rate > 59) return message.channel.send(`${emoji.error} Veuillez indiquer un nombre comprit entre 0 Et 59 secondes`);


        if (!channel.permissionsFor(message.guild.me).has(['MANAGE_CHANNELS']))
            return message.channel.send(`${emoji.error} Je n'ai pas l'autorisation de gérer ce salon...`);

        let reason = args.slice(index + 1).join(' ');
        if (!reason) reason = 'Aucune raison fournie';
        if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

        await channel.setRateLimitPerUser(rate, reason);


        if (rate === '0') {
            return message.channel.send(`${emoji.succes} J'ai désactivé le slowmode dans ce salon avec succès`);

        } else {

            return message.channel.send(`${emoji.succes} J'ai activé le slowmode dans ce salon avec succès`);
        }



    },
};
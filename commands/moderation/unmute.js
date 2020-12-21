const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const ms = require('ms');
module.exports = {
    name: 'unmute',
    description: 'Met fin au mute d\'un membre',

    guildOnly: true,
    args: 'user',
    usage: '@user',
    exemple: '@pauldb09',
    cat: 'moderation',
    permissions: ['MANAGE_ROLES'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_ROLES"],
    async execute(message, args, client) {


        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) {
            message.channel.send(`${emoji.err} Veuillez fournir un membre valide .`)
        }



        let role = message.guild.roles.cache.find(role => role.name === "Muted");
        if (!user.roles.cache.has(role.id)) return message.channel.send(`${emoji.error} Cette personne n'est pas déja mute...`);

        if (!role) {
            return message.channel.send(`${emoji.error} Cette personne n'est pas déja mute...`);
        }

        try {
            user.roles.remove(role)
            message.channel.send(`${emoji.succes} le mute de **${user.user.tag}** a pris fin !`);

        } catch (err) {
            message.channel.send(`${emoji.error} Je n'ai pas réussi à unmute ce membre , veuillez vérifier la hiérarchie.`);

        }





    },
};

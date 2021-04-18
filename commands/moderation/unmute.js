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


        let user = message.mentions.members.first() || message.guild.users.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.includes(args.join(" "))).first()
        if (!user) {
            return message.errorMessage(`Vous devez mentionner un membre valide ou fournir un ID valide.`)
        }



        let role = message.guild.roles.cache.find(role => role.name === "Muted");
        if (!role) {
            return message.errorMessage(`Cette personne n'est pas déja mute...`);
        }
        if (!user.roles.cache.has(role.id)) return message.errorMessage(`Cette personne n'est pas déja mute...`);



        try {
            user.roles.remove(role)
            message.succesMessage(`le mute de **${user.user.tag}** a pris fin !`);

        } catch (err) {
            message.errorMessage(`Je n'ai pas réussi à unmute ce membre , veuillez vérifier la hiérarchie des roles.`);

        }





    },
};
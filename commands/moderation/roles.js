const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const ms = require('ms');
module.exports = {
    name: 'roles',
    description: 'Ajoute ou supprime un certain rôle à un membre du serveur .',
    aliases: ['role'],
    guildOnly: true,
    args: true,
    usage: '@membre +/- @role',
    exemple: 'Pauldb09 + @membre',
    cat: 'moderation',
    permissions: ['MANAGE_ROLES'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_ROLES"],
    async execute(message, args, client) {


        let member;
        if (args.length) {
            member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.includes(args.join(" ")) || m.displayName.includes(args.join(" ")) || m.user.username.includes(args.join(" "))).first()

        } else {
            return message.errorMessage(`Vous devez mentionner un membre valide ou fournir un ID valide.`)

        }
        if (!member) {

            return message.errorMessage(`Vous devez mentionner un membre valide ou fournir un ID valide.`)

        }
        let action = args[1]
        if (action === '+') {
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]) || message.guild.roles.cache.filter(m => m.name.includes(args.slice(2).join(" "))).first();
            if (!role || role.name === 'everyone' || role.name === 'here') {
                return message.errorMessage(`Veuillez mentionner un rôle valide ou fournir un ID de rôle valide.`);
            }
            if (message.guild.me.roles.highest.comparePositionTo(role) < 0) {
                return message.errorMessage(`Ma position dans ce serveur n'est pas assez haute pour ajouter ce rôle.`);
            }
            if (member.roles.cache) {
                if (member.roles.cache.has(role.id)) return message.errorMessage(`Cette personne a déja le rôle ${role} , je ne peut donc pas lui ajouter.`);
            }
            member.roles.add(role.id).catch((error => {
                return message.errorMessage(`Une erreur est suvenue lorsque j'ai essayé d'ajouter le rôle ${role} à ${member}`)
            }))
            message.succesMessage(`J'ai donné le rôle ${role} à ${member} avec succès`)
        } else if (action === '-') {
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]) || message.guild.roles.cache.filter(m => m.name.includes(args.slice(2).join(" "))).first();
            if (!role || role.name === 'everyone' || role.name === 'here') {
                return message.errorMessage(`Veuillez mentionner un rôle valide ou fournir un ID de rôle valide.`);
            }
            if (message.guild.me.roles.highest.comparePositionTo(role) < 0) {
                return message.errorMessage(`Ma position dans ce serveur n'est pas assez haute pour ajouter ce rôle.`);
            }
            if (member.roles.cache) {
                if (!member.roles.cache.has(role.id)) return message.errorMessage(`Cette n'a pas le rôle ${role} , je ne peut donc pas lui enlever.`);

            } else {
                return message.errorMessage(`Cette n'a pas le rôle ${role} , je ne peut donc pas lui enlever.`);
            }
            member.roles.remove(role.id).catch((error => {
                return message.errorMessage(`Une erreur est suvenue lorsque j'ai essayé d'ajouter le rôle ${role} à ${member}`)
            }))
            message.succesMessage(`J'ai enlevé le rôle ${role} à ${member} avec succès`)
        } else {
            const reportEmbed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

            .setDescription(`Il vous faut des arguments pout la commande \`roles\` ! \nUsage correct : \`${message.guild.prefix}roles @membre +/- @role\``)

            .setFooter(message.client.footer)
                .setColor("#982318")

            message.channel.send(reportEmbed);
        }




    },
};
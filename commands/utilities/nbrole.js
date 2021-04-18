const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome')
const emoji = require('../../emojis.json')

module.exports = {
        name: 'nbrole',
        description: 'Montre combien de personnes ont un certain rôle sur le serveur',
        cat: 'utilities',

        aliases: ['role_num'],
        guildOnly: true,
        usage: '@role',
        exemple: '@membre',
        async execute(message, args) {

            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.filter(m => m.name.includes(args.join(" "))).first();
            if (!args.length) {
                return message.errorMessage(`Veuillez mentionner un rôle valide ou fournir un ID de rôle valide.`);
            }

            if (!role || role.name === '@everyone' || role.name === '@here') {
                return message.errorMessage(`Veuillez mentionner un rôle valide ou fournir un ID de rôle valide.`);
            }
            if (message.guild.memberCount !== message.guild.members.cache.size) await message.guild.members.fetch()
            let u = message.guild.members.cache.filter(u => u.roles.cache.has(role.id))
            if (u.size == 0) return message.errorMessage(`Il n'y a personne dans le serveur qui a le rôle ${role}`)
            const embed = new Discord.MessageEmbed()

            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

            .setColor(message.client.color)
                .setDescription(`Voici les **${u.size}** personnes qui ont le rôle ${role}`)
                .addField(`Personnes (${u.size})`, `${u.size > 20 ? `${u.map(x => `\`${x.user.tag}\``).slice(0,20 )} Et **${u.size - 20}** autres personnes ` : u.map(x => `\`${x.user.tag}\``)}`, true)
            .addField('Vous voulez des statistiques sur les rôles sur votre serveur ? ', `[Invitez moi](http://green-bot.xyz/invite)`)


        .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))


        message.channel.send(embed)


    },
};
const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome')
const emoji = require('../../emojis.json')

module.exports = {
    name: 'botautorole',
    description: 'Défini le role donné automatiquement au nouveaux bots',

    cat: 'configuration',

    guildOnly: true,
    usage: '@role',
    exemple: '@membre',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        if (args[0] === 'disable') {
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `autorole_bot` })
            if (verify) {
                const newchannel = await Welcome.findOneAndDelete({ serverID: message.guild.id, reason: `autorole_bot` });
                return message.succesMessage(`L'autorôle pour les bots a bien été désactivé sur ce serveur.`)
            } else {
                return message.errorMessage(`Vous devez avoir une configuration pour la supprimer`)
            }

        }
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.filter(m => m.name.includes(args.join(" "))).first();
 if (!args.length) {
          return message.errorMessage(`Veuillez mentionner un rôle valide ou fournir un ID de rôle valide.`);
        }

        if (!role || role.name === '@everyone' || role.name === '@here') {
            return message.errorMessage(`Veuillez mentionner un rôle valide ou fournir un ID de rôle valide.`);
        }

        const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `autorole_bot` })
        if (verify) {
            const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `autorole_bot` }, { $set: { channelID: role.id, reason: `autorole_bot` } }, { new: true });
            return message.succesMessage(`L'autorôle pour les bots a bien été mis à jour vers le role : \`@${role.name}\`.`)

        } else {
            const verynew = new Welcome({
                serverID: `${message.guild.id}`,
                channelID: `${role.id}`,
                reason: 'autorole_bot',
            }).save();
            return message.succesMessage(`L'autorôle pour les bots a bien été défini pour ce serveur : \`@${role.name}\`.`)

        }




    },
};
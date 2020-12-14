const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')

const adventure = require("../../database/models/adventure");
module.exports = {
    name: 'quete-list',
    description: 'Affiche toutes vos quetes en cours ou finies',

    aliases: ['list-quete'],
    cat: 'rpg',
    async execute(message, args) {
        const { client } = message;
        let channeldb = await adventure.find({ UserID: message.author.id })

        const reportEmbed = new Discord.MessageEmbed()
            .setTitle(`${emoji.quest} | Vos quetes`)


        .addField("Quêtes en cours", channeldb.map(rr => `${rr.active ? '⭐' : ''}\`${rr.nom}\` / Niveau ${rr.level} ,${rr.xp} XP  / ${rr.profil || 'profil non disponible pour cette quete'} `).join(`
                `) || `${emoji.error} Vous n\'avez aucunne quete en cours`)
            .addField("Quêtes finie ", `Vous n\'avez aucunne quête finie`)
            .setDescription(`Voici toutes vos quetes , leur dates , leur but et leur avancement.
         ⭐ = quete actuelle`)

        .setFooter(client.footer)

        .setColor(client.color);
        message.channel.send(reportEmbed);



    },
};
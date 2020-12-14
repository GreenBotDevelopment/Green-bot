const Discord = require('discord.js');
const config = require('../../config.json');
const emoji = require('../../emojis.json')
const guild = require('../../database/models/guild');
const levelModel = require('../../database/models/level');
module.exports = {
        name: 'leaderboard',
        description: 'Affiche le classement du serveur',
        aliases: ['classement', 'lb'],
        cat: 'level',
        async execute(message, args) {



            const userdata = await levelModel.find({ serverID: message.guild.id }).limit(5)
            const datacommands = await guild.find({ serverID: message.guild.id, reason: `command` }).limit(5)

            const embed = new Discord.MessageEmbed()
                .setColor(message.client.color)

            .setAuthor(`${message.guild.name} - Classement`, message.guild.iconURL({ dynamic: true, size: 512 }))
                .addField("Classement Textuel (5 premiers)", `${userdata.map(command => ` <@${command.userID}> | Niveau ${command.level} / ${command.xp} XP`).sort((a, b) => b.level - a.level).join(`
            `) || 'Aucunne données pour ce serveur'}`)
            .addField("Classement Vocal (5 premiers)",  'Aucunne données pour ce serveur')
            .addField("Commandes (5 premiers)",  `${datacommands.map(command => ` <@${command.content}> | ${command.description} commandes`).sort((a, b) => b.value - a.value).join(`
            `) || 'Aucunne données pour ce serveur'}`)

          


        .setTimestamp()
            .setFooter(message.client.footer || 'Green-Bot | Open source bot by 𝖕𝖆𝖚𝖑𝖉𝖇09#9846')

        message.channel.send({ embed })






    },
};
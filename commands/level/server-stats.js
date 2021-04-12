const Discord = require('discord.js');
const config = require('../../config.json');
const emoji = require('../../emojis.json')
const guild = require('../../database/models/guild');
const moment = require('moment')
const Voice = require("discord-voice");

const levelModel = require('../../database/models/level');
module.exports = {
        name: 'server-stats',
        description: 'Affiche les statistiques du serveur',
        aliases: ['serveur-stats', 'serv-stats'],
        cat: 'level',
        async execute(message, args) {

            let MessageCount = 0;
            const userdata = await levelModel.find({ serverID: message.guild.id })
            let firster = userdata.sort((a, b) => (a.messagec < b.messagec) ? 1 : -1).slice(0, 3)
            userdata.forEach(user => {
                MessageCount = MessageCount + user.messagec;
            });
            const rawLeaderboard = await Voice.fetchLeaderboard(message.guild.id, 3); // We grab top 10 users with most message(s) in the current server.


            const leaderboard = await Voice.computeLeaderboard(message.client, rawLeaderboard, true); // We process the leaderboard.

            const lb = leaderboard.map(e => `${e.position}. ${e.username}#${e.discriminator}\nVoice Time: ${e.voiceTime}ms`); // We map the outputs.
            const millisToMinutesAndSeconds = (millis) => {
                var minutes = Math.floor(millis / 60000);
                var seconds = ((millis % 60000) / 1000).toFixed(0);
                //ES6 interpolated literals/template literals 
                //If seconds is less than 10 put a zero in front.
                return `${minutes}:${(seconds < 10 ? "0" : "")}${seconds}`;
            }

            const embed = new Discord.MessageEmbed()
                .setAuthor(`📊 ${message.guild.name} - Classement`, message.guild.iconURL({ dynamic: true, size: 512 }))
                .addField(`✉ Statistiques Textuelles`, `**Messages envoyés** :\`${MessageCount}\`\n **Personnes qui ont envoyé des messages** : \`${userdata.length}\`\n **Soit ** \`${userdata.length /message.guild.memberCount *100}%\`**du serveur**`)
                .addField(`🏆 Utilisateurs les plus actifs`, firster.map(v => `<@${v.userID}> : Niveau \`${v.level}\` , \`${v.messagec}\` Messages `) || "Aucunnes données")
                .addField(`🏆 Classement Vocal`, rawLeaderboard.length > 0 ? `${leaderboard.map(e => `\`${e.position}\`. **${e.username}#${e.discriminator}**\nTemps en vocal: ${millisToMinutesAndSeconds(e.voiceTime)} Minutes `).join("\n")}` :"Pas assez de données pour ce serveur")

        .setDescription(`⏰ Statistiques depuis le  ${moment(message.guild.me.joinedTimestamp).locale('fr').format('LT ,')}  ${moment(message.guild.me.joinedTimestamp).locale('fr').fromNow()}`)
            .setColor(message.client.color)
            .setFooter(message.client.footer)
        message.channel.send({ embed })



    },
};
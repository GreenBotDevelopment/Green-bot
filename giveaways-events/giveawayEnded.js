const config = require('../config.json');
const Discord = require('discord.js');
const emojis = require('../emojis.json');
const Welcome = require('../database/models/Welcome')

module.exports = {


        async execute(giveaway, winners) {
            if (giveaway.message.partial) await giveaway.message.fetch();
            let message = giveaway.message;
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `giveaway_c` })
            let logschannel;
            if (verify) {
                logschannel = message.guild.channels.cache.get(verify.channelID);
            } else {
                logschannel = null;
            }
            winners.forEach((member) => {
                const logembede = new Discord.MessageEmbed()
                    .setTitle(`${emojis.succes} - Giveaway Gagné `)
                    .setURL('http://green-bot.xyz/')
                    .setDescription(`Félicitations **${member.user.username}** vous avez gagné [Ce giveaway](${message.url}) :gift: !\n __Prix__ : \n**${giveaway.prize}**`)
                    .setColor(config.color)
                    .setFooter(config.footer)
                member.send(logembede)
            });
            const logembed = new Discord.MessageEmbed()
                .setTitle(`${emojis.succes} - Giveaway Terminé `)
                .setURL('http://green-bot.xyz/')
                .setDescription(`[Ce giveaway](${message.url}) est terminé :gift: !\n __Gagnant(s)__ :\n${winners.map(w=>`<@${w.user.id}>`).join(" ")}`)
        .setColor(config.color)
        .setFooter(config.footer)
    if (logschannel) logschannel.send(logembed)
    }
};
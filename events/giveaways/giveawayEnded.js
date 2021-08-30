const config = require('../../config.js');
const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome')
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
                    .setTitle(`\`🏆\` Giveaway won`)
                    .setURL('https://green-bot.app/invite')
                    .setDescription(`Congrats **${member.user.username}**, You won [${giveaway.prize}](${message.url}) `)
                    .setColor(config.color)
                    .setFooter(config.footer)
                member.send({ embeds: [logembede] })
            });
            const logembed = new Discord.MessageEmbed()
                .setTitle(`\`⏲\` Giveaway ended`)
                .setURL('https://green-bot.app/invite')
                .setDescription(`[This giveaway](${message.url}) is ended :gift: !\n __Winner(s)__ :\n${winners.map(w=>`<@${w.user.id}>`).join(" ")}`)
        .setColor(config.color)
        .setFooter(config.footer)
    if (logschannel) logschannel.send({ embeds:[logembed]})
    }
};
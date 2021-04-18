const config = require('../config.json');
const Discord = require('discord.js');
const emojis = require('../emojis.json');

module.exports = {


    async execute(giveaway, member, reaction, client) {
        if (reaction.message.partial) await reaction.message.fetch();
        let message = reaction.message;
        const succese = new Discord.MessageEmbed()
            .setTitle(`${emojis.error} - Giveaway Terminé...`)
            .setURL('http://green-bot.xyz/')
            .setDescription(`[Ce giveaway](${message.url}) est terminé... vous ne pouvez donc pas participer.`)
            .addFields({ name: "🧷 Liens utliles", value: `
[Dashboard](http://green-bot.xyz/)-[Inviter le bot](http://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](http://discord.gg/nrReAmApVJ) - [Github](http://github.com/pauldb09/Green-bot)` })
            .setColor('#982318')
            .setFooter(config.footer)
        member.send(succese)
        return reaction.users.remove(member.user);
    }
};
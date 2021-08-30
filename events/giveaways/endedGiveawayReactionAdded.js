const config = require('../../config.js');
const Discord = require('discord.js');

module.exports = {


    async execute(giveaway, member, reaction, client) {
        if (reaction.message.partial) await reaction.message.fetch();
        let message = reaction.message;
        const succese = new Discord.MessageEmbed()
            .setTitle(`\`❌\` Entry denied`)
            .setURL('https://green-bot.app/invite')
            .setDescription(`[This giveaway](${message.url}) is ended.`)
            .setColor('#982318')
            .setFooter(config.footer)
        member.send({ embeds: [succese] })
        return reaction.users.remove(member.user);
    }
};
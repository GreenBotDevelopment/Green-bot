const Discord = require('discord.js');
const moment = require('moment')
module.exports = {
    name: 'uptime',
    description: 'Gives the bot uptime.',
    cat: 'utilities',
    async execute(message, args) {
        let uptime;
        let text;
        if (message.guild.settings.lang === "fr") {
            text = "est en ligne depuis"
            uptime = moment.duration(message.client.uptime).format("D [ jours] h[ heures] m[ minutes] s[ secondes]")
        } else {
            text = "is online from"
            uptime = moment.duration(message.client.uptime).format("D [ days] h[ hours] m[ minutes] s[ seconds]")
        }
        const embed = new Discord.MessageEmbed()
            .setAuthor(`${message.member.user.tag}`, message.member.user.displayAvatarURL())
            .setDescription(`**${message.client.user.tag}** ${text} **${uptime.replace("secondses","secondes")}**`)
            .setColor(message.guild.settings.color)
            .setFooter(`${message.client.footer} | Shard ${message.client.shard.ids[0]}/3 | Cluster 0`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
    },
};
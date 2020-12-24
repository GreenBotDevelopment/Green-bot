const discord = require('discord.js');
module.exports = (client, message, track) => {

    const unmuteEmbed = new discord.MessageEmbed()
        .setDescription(`🎶 Je joue désormais **${track.title}** de [${track.requestedBy}]`)
        .setFooter(message.client.footer)

    .setColor(message.client.color);
    message.channel.send(unmuteEmbed)

};
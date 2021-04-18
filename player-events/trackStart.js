const discord = require('discord.js');
module.exports = (client, message, track) => {

    let embed = new discord.MessageEmbed()
        .setColor(message.client.color)
        .setTitle(`Musique en cours`)
        .setDescription(`[${track.title}](${track.url})[<@${track.requestedBy.id}>]\n<:802916311972708372:811168497953800202> **Durée **: ${track.duration}`)
        .setThumbnail(track.thumbnail)
        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
    message.channel.send(embed)
};
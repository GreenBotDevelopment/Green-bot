const discord = require('discord.js');
module.exports = (client, message, queue, track) => {


    let embed = new discord.MessageEmbed()
        .setColor(message.client.color)
        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

    .setTitle(`Musique ajoutée`)
        .setDescription(`[${track.title}](${track.url})[<@${track.requestedBy.id}>]\n<:802916311972708372:811168497953800202> **Durée **: ${track.duration}`)
        .setThumbnail(track.thumbnail)
    message.channel.send(embed)
};